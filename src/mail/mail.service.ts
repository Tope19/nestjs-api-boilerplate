import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailservice: MailerService) {}

  async sendResetLink(user: User, url: string) {
    const resetLink = url;
    await this.mailservice.sendMail({
      to: user.email,
      subject: 'Password Reset Link',
      template: 'passwordReset',
      context: {
        name: user.fullName,
        url: resetLink,
      },
    });
  }
}
