import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { appConfig } from './app.config';
import { databaseConfig } from './database.config';
import { jwtConfig } from './jwt.config';
import { ConfigValidationService } from './config-validation.service';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      load: [appConfig, databaseConfig, jwtConfig],
      cache: true,
      expandVariables: true,
    }),
  ],
  providers: [ConfigValidationService],
  exports: [NestConfigModule, ConfigValidationService],
})
export class ConfigModule {}
