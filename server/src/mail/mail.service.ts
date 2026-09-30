import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { User } from '../users/entities/user.entity.js';
import { RequestDto } from './dto/request.dto.js';
import { ContactDto } from './dto/contact.dto.js';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;
  private readonly frontendUrl: string;
  private readonly from: string;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('MAIL_HOST'),
      port: this.config.get<number>('MAIL_PORT'),
      secure: this.config.get<number>('MAIL_PORT') === 465,
      auth: {
        user: this.config.get<string>('MAIL_USER'),
        pass: this.config.get<string>('MAIL_PASSWORD'),
      },
      // tls: {
      //   rejectUnauthorized: true,
      //   minVersion: 'TLSv1.2',
      // },
    });
    this.frontendUrl = this.config.get<string>('FRONTEND_URL') ?? '';
    this.from = this.config.get<string>('MAIL_FROM') ?? 'no-reply@example.com';
  }

  async sendVerificationEmail(user: User, rawToken: string): Promise<void> {
    const link = `${this.frontendUrl}/verify-email?token=${rawToken}`;
    await this.send(
      user.email,
      'Verify your email address',
      `<p>Hi ${user.firstName},</p>
       <p>Please confirm your email address to activate your account:</p>
       <p><a href="${link}">Verify my email</a></p>
       <p>This link expires in 24 hours. If you didn't create this account, you can ignore this email.</p>`,
    );
  }

  async sendPasscodeEmail(user: User, rawPasscode: string): Promise<void> {
    await this.send(
      user.email,
      'Login with your passcode',
      `<p>Hi ${user.firstName},</p>
       <p>Your passcode is: <strong>${rawPasscode}</strong></p>
       <p>This passcode will expire in <strong>5 minutes</strong>.</p>
       <p>If you didn't request this, you can safely ignore this email.</p>`,
    );
  }

  async sendTicketReplyNotification(
    user: User,
    ticketId: string,
    subject: string,
  ): Promise<void> {
    const link = `${this.frontendUrl}/support/tickets/${ticketId}`;
    await this.send(
      user.email,
      `Re: ${subject}`,
      `<p>Hi ${user.firstName},</p>
       <p>Your support ticket <strong>"${subject}"</strong> has been attended to by our team.</p>
       <p>Please log in to review the response and reply if you need further help:</p>
       <p><a href="${link}">View my ticket</a></p>`,
    );
  }

  async sendTicketUpdateNotification(
    user: User,
    ticketId: string,
    subject: string,
    status: string,
  ): Promise<void> {
    const link = `${this.frontendUrl}/support/tickets/${ticketId}`;
    await this.send(
      user.email,
      `Re: ${subject}`,
      `<p>Hi ${user.firstName},</p>
       <p>Your support ticket <strong>"${subject}"</strong> is currently <strong>"${status}"</strong>.</p>
       <p>You will be updated when there is a new response and reply if you need further help:</p>
       <p><a href="${link}">View my ticket</a></p>`,
    );
  }

  async sendWelcomeEmail(user: User): Promise<void> {
    await this.send(
      user.email,
      'Welcome!',
      `<p>Hi ${user.firstName},</p><p>Your email is verified and your account is ready to go.</p>`,
    );
  }

  async sendServiceRequest(
    requestDto: RequestDto,
  ): Promise<{ message: string }> {
    const { name, email, service, domain, provider, description, priority } =
      requestDto;

    if (!process.env.MAIL_USER) {
      throw new Error('MAIL_USER environment variable is not set.');
    }
    const sendTo = process.env.MAIL_USER;

    await this.send(
      sendTo,
      `New Service Request: ${service}`,
      `<h2>Request Notification</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Domain:</strong> ${domain}</p>
      <p><strong>Provider:</strong> ${provider || 'N/A'}</p>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Priority:</strong> ${priority}</p>`,
      sendTo, // replyTo
    );

    return { message: 'Message received' };
  }

  async sendContactForm(contactDto: ContactDto): Promise<{ message: string }> {
    const { name, email, subject, inquiry, message } = contactDto;

    if (!process.env.MAIL_USER) {
      throw new Error('MAIL_USER environment variable is not set.');
    }
    const sendTo = process.env.MAIL_USER;

    await this.send(
      sendTo,
      `Contact: ${subject}`,
      `<h2>Contact Notification</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Inquiry:</strong> ${inquiry}</p>
      <p><strong>Message:</strong> ${message}</p>`,
      sendTo, // replyTo
    );

    return { message: 'Message received' };
  }

  private async send(
    to: string,
    subject: string,
    html: string,
    replyTo?: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.from,
        to,
        subject,
        html,
        replyTo,
      });
    } catch (err) {
      this.logger.error(
        `Failed to send email to ${to}: ${(err as Error).message}`,
      );
    }
  }
}
