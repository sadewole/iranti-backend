import { HTMLTemplate } from './notification.template';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

type MailDataInput = {
  to: string[];
  replyTo?: string;
  subject: string;
  message?: string;
  mailType:
    | 'emailVerification'
    | 'emailVerified'
    | 'thankYouSignUp'
    | 'passwordReset'
    | 'noteReminder';
};

@Injectable()
export class NotificationService {
  private transport: any;
  private logger = new Logger(NotificationService.name);

  constructor(private configService: ConfigService) {
    this.transport = nodemailer.createTransport({
      host: this.configService.get('mailtrap.hostname'),
      port: this.configService.get('mailtrap.port'),
      auth: {
        user: this.configService.get('mailtrap.auth_user'),
        pass: this.configService.get('mailtrap.auth_pass'),
      },
    });
  }

  async sendEmail(body: MailDataInput): Promise<any> {
    try {
      const { message, mailType, ...rest } = body;

      const data = {
        ...rest,
        from: `Iranti <${this.configService.get('mailtrap.sender_email')}>`,
        html: HTMLTemplate(mailType, message),
      };

      const res = await this.transport.sendMail(data);

      return res;
    } catch (error) {
      this.logger.error(error);
      this.logger.error('<< Error sending email verification >>');
    }
  }
}
