import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthGuard } from '@/common/guards/auth.guard';
import { AuthModule } from '@/modules/auth/auth.module';
import { EmailModule } from '@/modules/email/email.module';
import { UsersModule } from '@/modules/users/users.module';
import { CustomConfigModule } from '@/config/config.module';
import { ResponseInterceptor } from '@/common/interceptor/response.interceptor';
import { GlobalExceptionFilter } from '@/common/exception-filter/global-exception.filter';

@Module({
  imports: [CustomConfigModule, EmailModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
