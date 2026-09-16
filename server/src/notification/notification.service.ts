import { Injectable } from '@nestjs/common';
import {
  ContactNotificationDto,
  RequestNotificationDto,
} from './dto/notification.dto';
import { Mail } from './../utils/mail';

@Injectable()
export class NotificationService {
  async requestService(requestNotificationDto: RequestNotificationDto) {
    const { name, email, service, domain, provider, description, priority } =
      requestNotificationDto;

    const message = `
      <h2>Notification Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Domain:</strong> ${domain}</p>
      <p><strong>Provider:</strong> ${provider || 'N/A'}</p>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Priority:</strong> ${priority}</p>
    `;

    const response = await new Mail().smtpMail(
      email,
      `New Request: ${service}`,
      message,
    );

    return response;
  }

  async contact(contactNotificationDto: ContactNotificationDto) {
    const { name, email, subject, inquiry, message } = contactNotificationDto;

    const body = `
      <h2>Notification Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Inquiry:</strong> ${inquiry}</p>
      <p><strong>Message:</strong> ${message}</p>
    `;

    const response = await new Mail().smtpMail(email, subject, body);

    return response;
  }
}
