import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService) {}

  /**
   * Get app env variables
   */
  get app(): {
    name: string;
    port: number;
    env: string;
    key: string;
    url: string;
    tz: string;

    startAt: string;
  } {
    return {
      name: this.configService.get<string>('app.name'),
      port: this.configService.get<number>('app.port'),
      env: this.configService.get<string>('app.env'),
      key: this.configService.get<string>('app.key'),
      url: this.configService.get<string>('app.url'),
      tz: this.configService.get<string>('app.tz'),

      startAt: this.configService.get<string>('app.startAt'),
    };
  }

  /**
   * Get redis env variable
   */
  get redis(): {
    host: string;
    port: number;
    password: string;
  } {
    return {
      host: this.configService.get<string>('redis.host'),
      port: this.configService.get<number>('redis.port'),
      password: this.configService.get<string>('redis.password'),
    };
  }

  redisUrl(): string {
    return `redis://:${this.redis.password}@${this.redis.host}:${this.redis.port}`;
  }
}
