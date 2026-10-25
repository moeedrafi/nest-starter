import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { IDatabase } from '@/config/env.config.interface';
import { envValidationSchema } from '@/config/env.config.validation';
import { authentication, database, email, server } from '@/config/env.config';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [server, authentication, database, email],
      validationSchema: envValidationSchema,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [database.KEY],
      useFactory: (databaseConfig: IDatabase): TypeOrmModuleOptions => ({
        type: 'postgres',

        url: databaseConfig.url,
        synchronize: databaseConfig.sync,
        ssl: databaseConfig.ssl
          ? {
              rejectUnauthorized: false,
            }
          : false,

        autoLoadEntities: true,

        migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
        migrationsRun: true,

        logging: false,

        extra: {
          max: 20,
          connectionTimeoutMillis: 10000,
        },
      }),
    }),
  ],
  providers: [],
  exports: [],
})
export class CustomConfigModule {}
