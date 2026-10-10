import { Client } from 'postmark';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { createTransport } from 'nodemailer';

export class Mail {
  private client: Client;

  constructor() {
    this.client = new Client(`${process.env.POSTMARK_API_KEY}`);
  }

  async sendMail(recipient: string, subject: string, message: string) {
    const response = await this.client.sendEmail({
      From: `KodasHub <${process.env.SMTP_USER}>`,
      To: recipient,
      Subject: subject,
      HtmlBody: message,
    });
    if (response.ErrorCode !== 0) {
      throw new BadRequestException(`Error sending email: ${response.Message}`);
    }

    return {
      message: 'Email sent successfully',
      messageID: response.MessageID,
      recipient: response.To,
      submittedAt: response.SubmittedAt,
    };
  }

  async smtpMail(recipient: string, subject: string, message: string) {
    const transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2',
      },
    });

    const mailResponse = await transporter.sendMail({
      from: `KodasHub <${process.env.SMTP_USER}>`,
      to: `KodasHub <${process.env.SMTP_USER}>`,
      subject: subject,
      html: message,
      replyTo: recipient,
    });

    if (mailResponse.rejectedErrors) {
      throw new InternalServerErrorException(
        `Error sending email: ${mailResponse?.rejectedErrors}`,
      );
    }

    return { message: mailResponse?.response };
  }
}
