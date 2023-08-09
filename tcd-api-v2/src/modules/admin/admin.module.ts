import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../../guards/jwt.strategy';
import { AwsService } from '../../services/aws-service';
import { User } from '../../entity/user.entity';
import { ConfigModule } from '@nestjs/config';
import { Diary } from '../../entity/diary.entity';
import { CommunityQuestion } from '../../entity/community-question.entity';
import { Video } from '../../entity/video.entity';
import { BannerAdvertisement } from '../../entity/banneradvertisement.entity';
import { Country } from '../../entity/country.entity';
import { ConsumptionFrequency } from '../../entity/consumptionfrequency.entity';
import { State } from '../../entity/state.entity';
import { SettingsMyEntourage } from '../../entity/settings-my-entourage';
import { TCDUpdates } from '../../entity/tcd-updates.entity';
import { Physiques } from '../../entity/physiques.entity';
import { Effects } from '../../entity/effects.entity';
import { Activity } from '../../entity/activities.entity';
import { Cannabinoids } from '../../entity/cannabinoids.entity';
import { Strain } from '../../entity/strain.entity';
import { Conditions } from '../../entity/conditions';
import { Symptoms } from '../../entity/symptoms.entity';
import { SubAdminController } from '../admin/subadmin/subadmin.controller';
import { SubAdminService } from '../admin/subadmin/subadmin.service';
import { Partner } from '../../entity/partner.entity';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'uAsBw6WxqD',
      signOptions: { expiresIn: '2d' },
    }),
    TypeOrmModule.forFeature([
      User,
      Diary,
      CommunityQuestion,
      Video,
      BannerAdvertisement,
      Country,
      ConsumptionFrequency,
      State,
      SettingsMyEntourage,
      TCDUpdates,
      Physiques,
      Effects,
      Activity,
      Cannabinoids,
      Strain,
      Conditions,
      Symptoms,
      Partner,
    ]),
    ConfigModule,
  ],
  controllers: [AdminController, SubAdminController],
  providers: [AdminService, AwsService, SubAdminService],
})
export class AdminModule {}
