import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './app.config';
import { DatabaseConfig } from './database.config';
import { JwtConfig } from './jwt.config';

@Injectable()
export class ConfigValidationService {
  constructor(private configService: ConfigService) {}

  validateConfiguration(): void {
    const appConfig = this.configService.get<AppConfig>('app');
    const dbConfig = this.configService.get<DatabaseConfig>('database');
    const jwtConfig = this.configService.get<JwtConfig>('jwt');

    if (!appConfig || !dbConfig || !jwtConfig) {
      throw new Error(
        'Configuration validation failed: Missing required configuration',
      );
    }

    // Validate port
    if (!appConfig.port || appConfig.port < 1 || appConfig.port > 65535) {
      throw new Error('Configuration validation failed: Invalid port number');
    }

    // Validate database port
    if (!dbConfig.port || dbConfig.port < 1 || dbConfig.port > 65535) {
      throw new Error(
        'Configuration validation failed: Invalid database port number',
      );
    }

    // Validate JWT secret
    if (!jwtConfig.secret || jwtConfig.secret.length < 10) {
      throw new Error(
        'Configuration validation failed: JWT secret must be at least 10 characters long',
      );
    }

    console.log('✅ Configuration validation passed');
  }

  getAppConfig(): AppConfig {
    const config = this.configService.get<AppConfig>('app');
    if (!config) {
      throw new Error('App configuration not found');
    }
    return config;
  }

  getDatabaseConfig(): DatabaseConfig {
    const config = this.configService.get<DatabaseConfig>('database');
    if (!config) {
      throw new Error('Database configuration not found');
    }
    return config;
  }

  getJwtConfig(): JwtConfig {
    const config = this.configService.get<JwtConfig>('jwt');
    if (!config) {
      throw new Error('JWT configuration not found');
    }
    return config;
  }
}
