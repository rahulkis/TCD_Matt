import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './config/configuration';
import { ApiModule } from './modules/api//api.module';
import { PartnerModule } from './modules/partner/partner.module';
import { DatabaseConfig } from './config/database.config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),

    ApiModule,
    PartnerModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
