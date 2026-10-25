import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { email } from '@/config/env.config';
import { IEmail } from '@/config/env.config.interface';
import { CustomConfigModule } from '@/config/config.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [CustomConfigModule],
      inject: [email.KEY],
      useFactory: (emailConfig: IEmail) => ({
        transport: {
          host: emailConfig.host,
          port: emailConfig.port,
          secure: emailConfig.secure,
          auth: {
            user: emailConfig.user,
            pass: emailConfig.password,
          },

          // 🔥 CRITICAL: prevent hanging
          connectionTimeout: 5000,
          greetingTimeout: 5000,
          socketTimeout: 5000,

          tls: {
            minVersion: 'TLSv1.2',
            rejectUnauthorized: true, // FIX THIS unless you are in dev only
          },
        },
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
