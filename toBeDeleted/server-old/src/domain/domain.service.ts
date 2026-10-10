import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CheckDomainDto,
  UpdateContactDetailsDto,
  UpdateDomainStatusDto,
  UpdateNameserverDto,
} from './dto/domain.dto';
import { createHmac } from 'node:crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Domain } from './entities/domain.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class DomainService {
  constructor(
    @InjectRepository(Domain) private readonly domainRepo: Repository<Domain>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findAll() {
    const domains = await this.domainRepo.find();
    return { message: 'Domains retrieved successfully', result: domains };
  }

  async whoisChecker(dto: CheckDomainDto) {
    const url = `https://domaincheck.httpapi.com/api/domains/available.json?auth-userid=${process.env.WHOIS_ID}&api-key=${process.env.WHOIS_KEY}&domain-name=${dto.name}&tlds=${dto.tld}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok)
      throw new InternalServerErrorException('WHOIS API request failed');

    const result = await response.json();
    if (result[dto.name + '.' + dto.tld].status !== 'available') {
      const url = `https://domain-availability.whoisxmlapi.com/api/v1?apiKey=${process.env.WHOIS_API_KEY}&domainName=${dto.name}.${dto.tld}&credits=DA`;
      const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
      const result = await response.json();
      if (
        !result.DomainInfo?.domainAvailability ||
        result.DomainInfo?.domainAvailability !== 'AVAILABLE'
      ) {
        return { status: false, message: 'Domain is taken', result };
      }

      // Get pricing for available domain
      return await this.getPricing(dto.tld, result.DomainInfo.domainName);
    }

    // Get pricing for available domain
    return await this.getPricing(dto.tld, dto.name + '.' + dto.tld);
  }

  async search(domain: string) {
    if (!domain) throw new BadRequestException('Domain query is required');

    const domainName = await this.domainRepo.findOne({
      where: { name: domain },
      select: [
        'id',
        'name',
        'status',
        'user',
        'registrationPeriod',
        'registrationPrice',
        'expiryDate',
      ],
    });
    if (!domainName) throw new NotFoundException('Domain not found');

    return { message: 'Domain retrieved successfully', result: domainName };
  }

  async register(
    dto: { name: string; regPeriod: string; status?: string },
    userId: string,
  ) {
    if (!userId) throw new BadRequestException('User ID is required');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (
      !user.firstName ||
      !user.lastName ||
      !user.companyName ||
      !user.email ||
      !user.address ||
      !user.city ||
      !user.state ||
      !user.zipCode ||
      !user.country ||
      !user.phoneNumber
    ) {
      throw new BadRequestException(
        'Profile is incomplete, update your account',
      );
    }

    const tld = this.tldIdentifier(dto.name);
    if (tld != 'ng' && tld != 'com.ng' && tld != 'org.ng' && tld != 'name.ng') {
      const result = await this.registerViaRC(
        dto.name,
        parseInt(dto.regPeriod),
        userId,
      );
      console.log('Domain registration failed', result);
      if (!result) {
        throw new BadRequestException('Domain registration failed');
      }

      // await this.domainRepo.save({
      //   name: dto.name,
      //   user: { id: userId },
      //   registrationPeriod: parseInt(dto.regPeriod),
      //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      //   registrationPrice: Number((result as any)?.order?.totalamount) || 0,
      //   expiryDate: new Date(),
      //   checkOutUrl: '',
      //   status: dto.status || 'active',
      // });
      return {
        message: 'Domain registered successfully',
        result: { id: '<DOMAIN_ID>' },
      };
    }

    // const result = await this.registerViaGO54(
    //   dto.name,
    //   parseInt(dto.regPeriod),
    //   user,
    // );
    // if (result?.status != 'success')
    //   throw new BadRequestException(result.error);

    // await this.domainRepo.save({
    //   name: dto.name,
    //   user: { id: userId },
    //   registrationPeriod: parseInt(dto.regPeriod),
    //   registrationPrice: result.order?.totalamount ?? 0,
    //   expiryDate: result.order?.expirydate ?? null,
    //   checkOutUrl: '',
    //   status: dto.status || 'active',
    // });
    return {
      message: 'Domain registered successfully',
      result: { id: '<DOMAIN_ID>' },
    };
  }

  async findUserDomains(userId: string) {
    if (!userId) throw new BadRequestException('User ID is required');

    const domains = await this.domainRepo.find({
      where: { user: { id: userId } },
    });
    return { message: 'Domains retrieved successfully', result: domains };
  }

  async findOneDomain(domainId: string) {
    if (!domainId) throw new BadRequestException('Domain ID is required');

    const domain = await this.domainRepo.findOne({ where: { id: domainId } });
    if (!domain) throw new NotFoundException('Domain not found');
    return { message: 'Domain retrieved successfully', result: domain };
  }

  async renew(domainId: string, regPeriod: string, idProtection: boolean) {
    const domain = await this.domainRepo.findOne({ where: { id: domainId } });
    if (!domain) throw new NotFoundException('Domain not found');

    const url = `${process.env.GO54_ENDPOINT}/order/domains/renew`;
    const urlencoded = new URLSearchParams();
    urlencoded.append('domain', domain.name);
    urlencoded.append('regperiod', regPeriod);
    urlencoded.append('addons[dnsmanagement]', '0');
    urlencoded.append('addons[emailforwarding]', '1');
    urlencoded.append('addons[idprotection]', idProtection ? '1' : '0');

    const response = await fetch(url, {
      method: 'POST',
      headers: this.constructHeader(),
      body: urlencoded,
      redirect: 'follow',
    });
    const result = await response.json();
    if (result.error) throw new BadRequestException(result.error);

    await this.domainRepo.update(domainId, {
      status: 'active',
      registrationPeriod: parseInt(regPeriod),
      registrationPrice: result.order?.totalamount ?? 0,
      expiryDate: result.order?.expirydate ?? null,
    });

    return { message: 'Domain renewed successfully', result };
  }

  async getEppCode(domainId: string, userId: string) {
    const domain = await this.domainRepo.findOne({
      where: { id: domainId, user: { id: userId } },
    });
    if (!domain) throw new NotFoundException('Domain not found');

    const url = `${process.env.GO54_ENDPOINT}/domains/${domain.name}/eppcode`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.constructHeader(),
      redirect: 'follow',
    });
    const result = await response.json();
    if (result.error) throw new BadRequestException(result.error);

    return { message: 'EPP code retrieved successfully', result };
  }

  async getLockStatus(domainId: string, userId: string) {
    const domain = await this.domainRepo.findOne({
      where: { id: domainId, user: { id: userId } },
    });
    if (!domain) throw new NotFoundException('Domain not found');

    const url = `${process.env.GO54_ENDPOINT}/domains/${domain.name}/lock`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.constructHeader(),
      redirect: 'follow',
    });
    const result = await response.json();
    if (result.error) throw new BadRequestException(result.error);

    return { message: 'Lock status retrieved successfully', result };
  }

  async updateLockStatus(domainId: string, status: string) {
    const domain = await this.domainRepo.findOne({ where: { id: domainId } });
    if (!domain) throw new NotFoundException('Domain not found');

    const url = `${process.env.GO54_ENDPOINT}/domains/${domain.name}/lock`;
    var urlencoded = new URLSearchParams();
    urlencoded.append('lockstatus', status);

    const response = await fetch(url, {
      method: 'POST',
      headers: this.constructHeader(),
      body: urlencoded,
      redirect: 'follow',
    });
    const result = await response.json();
    if (result.error) throw new BadRequestException(result.error);

    return { message: 'Lock status retrieved successfully', result };
  }

  async getContactDetails(domainId: string, userId: string) {
    const domain = await this.domainRepo.findOne({
      where: { id: domainId, user: { id: userId } },
    });
    if (!domain) throw new NotFoundException('Domain not found');

    const url = `${process.env.GO54_ENDPOINT}/domains/${domain.name}/contact`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.constructHeader(),
      redirect: 'follow',
    });
    const result = await response.json();
    if (result.error) throw new BadRequestException(result.error);

    return { message: 'Contact details retrieved successfully', result };
  }

  async updateContactDetails(dto: UpdateContactDetailsDto) {
    const domain = await this.domainRepo.findOne({
      where: { id: dto.domainId },
    });
    if (!domain) throw new NotFoundException('Domain not found');

    const url = `${process.env.GO54_ENDPOINT}/domains/${domain.name}/contact`;
    const urlencoded = new URLSearchParams();
    urlencoded.append('contactdetails[registrant][firstname]', dto.firstName);
    urlencoded.append('contactdetails[registrant][lastname]', dto.lastName);
    urlencoded.append(
      'contactdetails[registrant][fullname]',
      `${dto.firstName} ${dto.lastName}`,
    );
    urlencoded.append(
      'contactdetails[registrant][companyname]',
      dto.companyName,
    );
    urlencoded.append('contactdetails[registrant][email]', dto.email);
    urlencoded.append('contactdetails[registrant][address1]', dto.address);
    urlencoded.append('contactdetails[registrant][city]', dto.city);
    urlencoded.append('contactdetails[registrant][state]', dto.state);
    urlencoded.append('contactdetails[registrant][zipcode]', dto.zipCode);
    urlencoded.append('contactdetails[registrant][country]', dto.country);
    urlencoded.append(
      'contactdetails[registrant][phonenumber]',
      dto.phoneNumber,
    );
    urlencoded.append('contactdetails[admin][firstname]', dto.firstName);
    urlencoded.append('contactdetails[admin][lastname]', dto.lastName);
    urlencoded.append(
      'contactdetails[admin][fullname]',
      `${dto.firstName} ${dto.lastName}`,
    );
    urlencoded.append('contactdetails[admin][companyname]', dto.companyName);
    urlencoded.append('contactdetails[admin][email]', dto.email);
    urlencoded.append('contactdetails[admin][address1]', dto.address);
    urlencoded.append('contactdetails[admin][city]', dto.city);
    urlencoded.append('contactdetails[admin][state]', dto.state);
    urlencoded.append('contactdetails[admin][zipcode]', dto.zipCode);
    urlencoded.append('contactdetails[admin][country]', dto.country);
    urlencoded.append('contactdetails[admin][phonenumber]', dto.phoneNumber);
    urlencoded.append('contactdetails[billing][firstname]', dto.firstName);
    urlencoded.append('contactdetails[billing][lastname]', dto.lastName);
    urlencoded.append(
      'contactdetails[billing][fullname]',
      `${dto.firstName} ${dto.lastName}`,
    );
    urlencoded.append('contactdetails[billing][companyname]', dto.companyName);
    urlencoded.append('contactdetails[billing][email]', dto.email);
    urlencoded.append('contactdetails[billing][address1]', dto.address);
    urlencoded.append('contactdetails[billing][city]', dto.city);
    urlencoded.append('contactdetails[billing][state]', dto.state);
    urlencoded.append('contactdetails[billing][zipcode]', dto.zipCode);
    urlencoded.append('contactdetails[billing][country]', dto.country);
    urlencoded.append('contactdetails[billing][phonenumber]', dto.phoneNumber);
    urlencoded.append('contactdetails[tech][firstname]', dto.firstName);
    urlencoded.append('contactdetails[tech][lastname]', dto.lastName);
    urlencoded.append(
      'contactdetails[tech][fullname]',
      `${dto.firstName} ${dto.lastName}`,
    );
    urlencoded.append('contactdetails[tech][companyname]', dto.companyName);
    urlencoded.append('contactdetails[tech][email]', dto.email);
    urlencoded.append('contactdetails[tech][address1]', dto.address);
    urlencoded.append('contactdetails[tech][city]', dto.city);
    urlencoded.append('contactdetails[tech][state]', dto.state);
    urlencoded.append('contactdetails[tech][zipcode]', dto.zipCode);
    urlencoded.append('contactdetails[tech][country]', dto.country);
    urlencoded.append('contactdetails[tech][phonenumber]', dto.phoneNumber);

    const response = await fetch(url, {
      method: 'POST',
      headers: this.constructHeader(),
      body: urlencoded,
      redirect: 'follow',
    });
    const result = await response.json();
    if (result.error) throw new BadRequestException(result.error);

    return { message: 'Contact details updated successfully', result };
  }

  async getNameservers(domainId: string, userId: string) {
    const domain = await this.domainRepo.findOne({
      where: { id: domainId, user: { id: userId } },
    });
    if (!domain) throw new NotFoundException('Domain not found');

    const url = `${process.env.GO54_ENDPOINT}/domains/${domain.name}/nameservers`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.constructHeader(),
      redirect: 'follow',
    });
    const result = await response.json();
    if (result.error) throw new BadRequestException(result.error);

    return { message: 'Nameservers retrieved successfully', result };
  }

  async updateNameservers(dto: UpdateNameserverDto) {
    const domain = await this.domainRepo.findOne({
      where: { id: dto.domainId },
    });
    if (!domain) throw new NotFoundException('Domain not found');

    const url = `${process.env.GO54_ENDPOINT}/domains/${domain.name}/nameservers`;
    const urlencoded = new URLSearchParams();
    urlencoded.append('ns1', dto.nameserver1);
    urlencoded.append('ns2', dto.nameserver2);
    if (dto.nameserver3) urlencoded.append('ns3', dto.nameserver3);
    if (dto.nameserver4) urlencoded.append('ns4', dto.nameserver4);

    const response = await fetch(url, {
      method: 'POST',
      headers: this.constructHeader(),
      body: urlencoded,
      redirect: 'follow',
    });
    const result = await response.json();
    if (result.error) throw new BadRequestException(result.error);

    return { message: 'Nameservers updated successfully', result };
  }

  async updateDomainStatus(dto: UpdateDomainStatusDto) {
    const domain = await this.domainRepo.findOne({
      where: { id: dto.domainId },
    });
    if (!domain) throw new NotFoundException('Domain not found');

    domain.status = dto.status;
    if (dto.expiryDate) domain.expiryDate = dto.expiryDate;
    await this.domainRepo.save(domain);
    return { message: 'Domain status updated successfully' };
  }

  // Internal functions
  private constructHeader() {
    const myHeaders = new Headers();
    myHeaders.append('username', `${process.env.GO54_USERNAME}`);
    myHeaders.append('token', this.tokenGenertor());
    return myHeaders;
  }

  private tokenGenertor() {
    const now = new Date();
    const gmtDate = new Date(now.toISOString());
    const formattedDate = gmtDate.toISOString().slice(2, 13).replace('T', ' ');
    const message = `${process.env.GO54_USERNAME}:${formattedDate}`;
    const secret = `${process.env.GO54_API_KEY}`;

    // Perform HMAC SHA256 and Base64 encode — secret is the key, message is the data
    const hmacToken = createHmac('sha256', message)
      .update(secret)
      .digest('hex');
    return Buffer.from(hmacToken).toString('base64');
  }

  private tldIdentifier(domain: string) {
    let tld = domain.split('.').pop();
    if (domain.split('.').length > 2) {
      tld = domain.split('.').slice(-2).join('.');
    }
    return tld;
  }

  private async getPricing(tld: string, domainName: string) {
    const pricingUrl = `${process.env.GO54_ENDPOINT}/tlds/pricing?lockstatus=true`;

    const pricingResponse = await fetch(pricingUrl, {
      method: 'GET',
      headers: this.constructHeader(),
      redirect: 'follow',
    });
    const data = await pricingResponse.json();
    if (data.error) throw new BadRequestException(data.error);

    const price = data.find(
      (item: any) => item.tld === `.${tld}` && item.currencyCode === 'NGN',
    );
    if (!price)
      throw new BadRequestException(
        `TLD '.${tld}' is not supported or has no NGN pricing`,
      );
    const vat = (parseFloat(price.registrationPrice) * 7.5) / 100;
    return {
      status: true,
      message: 'Domain is available',
      result: {
        domainName,
        price: parseFloat(price.registrationPrice),
        total: parseFloat(price.registrationPrice) + vat,
      },
    };
  }

  // This function is for registering domains via ResellerClub API
  private async registerViaRC(
    domain: string,
    year: number,
    userId: string,
    discount?: number,
  ) {
    const url = `https://test.httpapi.com/api/domains/register.xml?auth-userid=${process.env.WHOIS_ID}&api-key=${process.env.WHOIS_KEY}&domain-name=${domain}&years=${year}&ns=ns1.kodashub.com&ns=ns2.kodashub.com&customer-id=${userId}&reg-contact-id=${userId}&admin-contact-id=${userId}&tech-contact-id=${userId}&billing-contact-id=${userId}&invoice-option=KeepInvoice&discount-amount=${discount || 0.0}`;
    const response = await fetch(url, {
      method: 'POST',
      signal: AbortSignal.timeout(30000),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      redirect: 'follow',
    });
    if (!response.ok) {
      console.error('RC API request failed with status:', response);
      throw new InternalServerErrorException(
        response.statusText || 'RC API request failed',
      );
    }
    const result = await response.text();
    return result;
  }

  // This function is for registering domains via GO54 API
  private async registerViaGO54(
    domain: string,
    year: number,
    user: User,
    discount?: number,
  ) {
    const url = `${process.env.GO54_ENDPOINT}/order/domains/register`;
    console.log(discount);

    const urlencoded = new URLSearchParams();
    urlencoded.append('domain', domain);
    urlencoded.append('regperiod', year.toString());
    urlencoded.append('nameservers[ns1]', 'ns1.google.com');
    urlencoded.append('nameservers[ns2]', 'ns2.google.com');
    urlencoded.append('contacts[registrant][firstname]', user.firstName);
    urlencoded.append('contacts[registrant][lastname]', user.lastName);
    urlencoded.append(
      'contacts[registrant][fullname]',
      `${user.firstName} ${user.lastName}`,
    );
    urlencoded.append(
      'contacts[registrant][companyname]',
      user?.companyName || '',
    );
    urlencoded.append('contacts[registrant][email]', user.email || '');
    urlencoded.append('contacts[registrant][address1]', user?.address || '');
    urlencoded.append('contacts[registrant][city]', user?.city || '');
    urlencoded.append('contacts[registrant][state]', user?.state || '');
    urlencoded.append('contacts[registrant][zipcode]', user?.zipCode || '');
    urlencoded.append('contacts[registrant][country]', user?.country || '');
    urlencoded.append(
      'contacts[registrant][phonenumber]',
      user?.phoneNumber || '',
    );
    urlencoded.append('contacts[admin][firstname]', user.firstName);
    urlencoded.append('contacts[admin][lastname]', user.lastName);
    urlencoded.append(
      'contacts[admin][fullname]',
      `${user.firstName} ${user.lastName}`,
    );
    urlencoded.append('contacts[admin][companyname]', user.companyName || '');
    urlencoded.append('contacts[admin][email]', user.email || '');
    urlencoded.append('contacts[admin][address1]', user?.address || '');
    urlencoded.append('contacts[admin][city]', user?.city || '');
    urlencoded.append('contacts[admin][state]', user?.state || '');
    urlencoded.append('contacts[admin][zipcode]', user?.zipCode || '');
    urlencoded.append('contacts[admin][country]', user?.country || '');
    urlencoded.append('contacts[admin][phonenumber]', user?.phoneNumber || '');
    urlencoded.append('contacts[billing][firstname]', user.firstName);
    urlencoded.append('contacts[billing][lastname]', user.lastName);
    urlencoded.append(
      'contacts[billing][fullname]',
      `${user.firstName} ${user.lastName}`,
    );
    urlencoded.append(
      'contacts[billing][companyname]',
      user?.companyName || '',
    );
    urlencoded.append('contacts[billing][email]', user.email);
    urlencoded.append('contacts[billing][address1]', user?.address || '');
    urlencoded.append('contacts[billing][city]', user?.city || '');
    urlencoded.append('contacts[billing][state]', user?.state || '');
    urlencoded.append('contacts[billing][zipcode]', user?.zipCode || '');
    urlencoded.append('contacts[billing][country]', user?.country || '');
    urlencoded.append(
      'contacts[billing][phonenumber]',
      user?.phoneNumber || '',
    );
    urlencoded.append('contacts[tech][firstname]', user.firstName);
    urlencoded.append('contacts[tech][lastname]', user.lastName);
    urlencoded.append(
      'contacts[tech][fullname]',
      `${user.firstName} ${user.lastName}`,
    );
    urlencoded.append('contacts[tech][companyname]', user?.companyName || '');
    urlencoded.append('contacts[tech][email]', user.email);
    urlencoded.append('contacts[tech][address1]', user?.address || '');
    urlencoded.append('contacts[tech][city]', user?.city || '');
    urlencoded.append('contacts[tech][state]', user?.state || '');
    urlencoded.append('contacts[tech][zipcode]', user?.zipCode || '');
    urlencoded.append('contacts[tech][country]', user?.country || '');
    urlencoded.append('contacts[tech][phonenumber]', user?.phoneNumber || '');

    const response = await fetch(url, {
      method: 'POST',
      signal: AbortSignal.timeout(30000),
      headers: this.constructHeader(),
      body: urlencoded,
      redirect: 'follow',
    });
    if (!response.ok) {
      console.error('GO54 API request failed with status:', response);
      throw new InternalServerErrorException('GO54 API request failed');
    }
    const result = await response.text();
    console.log(result);
    return result;
  }
}
