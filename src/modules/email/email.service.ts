import { join } from 'path';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmailToMultipleUsers(
    to: string[],
    subject: string,
    html: string,
    cc: string[] = [],
  ): Promise<void> {
    const mailOptions = {
      to,
      cc: cc.length ? cc.filter(Boolean).join(',') : undefined,
      subject,
      html: html,
      attachments: [
        {
          filename: 'sybridlogo.png',
          path: join(process.cwd(), 'public/images/sybridlogo.png'),
          cid: 'sybridlogo',
        },
      ],
    };

    try {
      await this.mailerService.sendMail(mailOptions);
      console.log('Email sent successfully to:', to.join(', '));
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async resetPasswordMail(
    to: string,
    subject: string,
    html: string,
    cc: string[] = [],
  ): Promise<void> {
    const mailOptions = {
      to,
      cc: cc.length ? cc.filter(Boolean).join(',') : undefined,
      subject,
      html: html,
    };

    await this.mailerService.sendMail(mailOptions);
  }
}
