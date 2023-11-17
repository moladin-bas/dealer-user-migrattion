import { Module } from '@nestjs/common';
import { DbModule } from './config/db/db.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      load: [appConfig],
    }),
    DbModule,
    UserModule,
  ],
})
export class AppModule {}
