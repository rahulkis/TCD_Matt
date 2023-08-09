import { Module } from '@nestjs/common';
import { PartnerapiModule } from './partnerapi/partnerapi.module';

@Module({
  imports: [PartnerapiModule]
})
export class PartnerModule { }
