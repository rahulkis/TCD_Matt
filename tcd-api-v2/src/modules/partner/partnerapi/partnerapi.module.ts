import { Module } from '@nestjs/common';
import { PartnerapiService } from './partnerapi.service';
import { PartnerapiController } from './partnerapi.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnerSupport } from '../../../entity/partnersupport.entity';
import { Diary } from '../../../entity/diary.entity';
import { Product } from '../../../entity/product.entity';
import { Partner } from '../../../entity/partner.entity';
import { User } from '../../../entity/user.entity';
import { Coa } from '../../../entity/coa.entity';
import { PartnerLogging } from '../../../entity/partner-logging.entity';
import { JwtStrategy } from '../../../guards/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ProductType } from '../../../entity/product-type.entity';
import { ConsumptionReason } from '../../../entity/consumptionreason.entity';
import { Campaign } from '../../../entity/campaign.entity';
import { Strain } from '../../../entity/strain.entity';
import { Effects } from '../../../entity/effects.entity';
import { Advertisement } from '../../../entity/advertisement.entity';
import { AwsService } from '../../../services/aws-service';
import { Country } from '../../../entity/country.entity';
import { State } from '../../../entity/state.entity';
import { TCDUpdates } from '../../../entity/tcd-updates.entity';
import { Symptoms } from '../../../entity/symptoms.entity';
import { Activity } from '../../../entity/activities.entity';
import { Conditions } from '../../../entity/conditions';
import { ReferralCode } from 'src/entity/referral_code.entity';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'uAsBw6WxqD',
      signOptions: { expiresIn: '2d' },
    }),
    TypeOrmModule.forFeature([
      PartnerSupport,
      Diary,
      Product,
      Partner,
      User,
      Coa,
      PartnerLogging,
      ProductType,
      ConsumptionReason,
      Campaign,
      Strain,
      Effects,
      Advertisement,
      Country,
      State,
      TCDUpdates,
      Symptoms,
      Activity,
      Conditions,
      ReferralCode,
    ]),
  ],
  controllers: [PartnerapiController],
  providers: [PartnerapiService, AwsService],
})
export class PartnerapiModule { }
