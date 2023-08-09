import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../../../entity/user.entity';
import { State } from '../../../entity/state.entity';
import { ConsumptionFrequency } from '../../../entity/consumptionfrequency.entity';
import { Country } from '../../../entity/country.entity';
import { Physiques } from '../../../entity/physiques.entity';
import { Strain } from '../../../entity/strain.entity';
import { ConsumptionReason } from '../../../entity/consumptionreason.entity';
import { Article } from '../../../entity/article.entity';
import { ArticleCategories } from '../../../entity/articlecategory.entity';
import { Partner } from '../../../entity/partner.entity';
import { Diary } from '../../../entity/diary.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../../../guards/jwt.strategy';
import { Contacts } from '../../../entity/contact.entity';
import { Feedback } from '../../../entity/feedback.entity';
import { FaqCategory } from '../../../entity/faqcategory.entity';
import { Faq } from '../../../entity/faq.entity';
import { Video } from '../../../entity/video.entity';
import { FavouriteVideo } from '../../../entity/favouritevideo.entity';
import { UserBlocked } from '../../../entity/blocked-user.entity';
import { VideoComments } from '../../../entity/video_comments.entity';
import { ProductType } from '../../../entity/product-type.entity';
import { Product } from '../../../entity/product.entity';
import { CoaJobStatus } from '../../../entity/coajobstatus.entity';
import { AwsService } from '../../../services/aws-service';
import { Coa } from '../../../entity/coa.entity';
import { SearchLogs } from '../../../entity/search-logs.entity';
import { CommunityQuestion } from '../../../entity/community-question.entity';
import { CommunityQuestionCategory } from '../../../entity/community-question-category.entity';
import { FavouriteCommunityQuestion } from '../../../entity/favourite_community_question.entity';
import { CommunityComments } from '../../../entity/community_comments';
import { Summary } from '../../../entity/coa-summary.entity';
import { CannabinoidProfile } from '../../../entity/cannabinoid-profile.entity';
import { Composition } from '../../../entity/composition.entity';
import { Terpenes } from '../../../entity/terpenes.entity';
import { Pesticides } from '../../../entity/pesticides.entity';
import { Microbials } from '../../../entity/microbials.entity';
import { Mycotoxins } from '../../../entity/mycotoxins.entity';
import { HeavyMetals } from '../../../entity/heavy-metals.entity';
import { Effects } from '../../../entity/effects.entity';
import { Symptoms } from '../../../entity/symptoms.entity';
import { Activity } from '../../../entity/activities.entity';
import { Conditions } from '../../../entity/conditions';
import { Cannabinoids } from '../../../entity/cannabinoids.entity';
import { CmsPages } from '../../../entity/cmspages.entity';
import { ChemicalCompound } from '../../../entity/chemical-compound.entity';
import { ConsumptionNegative } from '../../../entity/consumptionnegative.entity';
import { FavouriteEntry } from '../../../entity/favouriteentry.entity';
import { EntryComments } from '../../../entity/diary-entry-comments';
import { UserSymptoms } from '../../../entity/user-symptoms.entity';
import { UserActivities } from '../../../entity/user-activities.entity';
import { UserEffects } from '../../../entity/user-effects.entity';
import { UserConditions } from '../../../entity/user-conditions.entity';
import { UserCannabinoids } from '../../../entity/user-cannabinoids.entity';
import { BannerAdvertisement } from '../../../entity/banneradvertisement.entity';
import { Moods } from '../../../entity/mood.entity';
import { SettingsMyEntourage } from '../../../entity/settings-my-entourage';
import { UserComments } from '../../../entity/user_comments.entity';
import { ConsumptionMethod } from '../../../entity/consumption-method.entity';
import { Advertisement } from '../../../entity/advertisement.entity';
import { Campaign } from '../../../entity/campaign.entity';
import { TerpenesProfile } from '../../../entity/terpenes-profile.entity';
import { UserActualEffects } from '../../../entity/user-actualeffects';
import { UserPreActivities } from '../../../entity/user-preactivities';
import { UserPreConditions } from '../../../entity/user-preconditions';
import { UserPreSymptoms } from '../../../entity/user-presymptoms';
import { UserDesiredEffects } from '../../../entity/user-desiredeffects';
import { UserPreEffects } from '../../../entity/user-preeffects.entity';
import { UserDesiredActivities } from '../../../entity/user-desiredactivities.entity';
import { UserDesiredSymptoms } from '../../../entity/user-desiredsymptoms.entity';
import { UserDesiredConditions } from '../../../entity/user-desiredconditions.entity';
import { UserActualConditions } from '../../../entity/user-actualconditions.entity';
import { UserActualActivities } from '../../../entity/user-actualactivities.entity';
import { UserActualSymptoms } from '../../../entity/user-actualsymptoms.entity';
import { UserMidPointActivities } from '../../../entity/user-midpointactivities.entity';
import { UserMidPointEffects } from '../../../entity/user-midpointeffects.entity';
import { UserMidPointSymptoms } from '../../../entity/user-midpointsymptoms.entity';
import { UserMidPointConditions } from '../../../entity/user-midpointconditions.entity';
import { MeasurementUnits } from '../../../entity/measurementunits.entity';
import { MeasurementScales } from '../../../entity/measurementscales.entity';
import { ReportReason } from '../../../entity/reportreason.entity';
import { ReportPublicEntries } from '../../../entity/report-public-entries.entity';
import { ReportQuestion } from '../../../entity/report-question.entity';
import { ReportedComment } from '../../../entity/reported-comment.entity';
import { ReportVideo } from '../../../entity/report-video.entity';
import { UserNegativeConsumption } from '../../../entity/user-consumptionnegative.entity';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'uAsBw6WxqD',
      signOptions: { expiresIn: '2d' },
    }),
    TypeOrmModule.forFeature([
      Summary,
      CannabinoidProfile,
      Composition,
      Terpenes,
      Pesticides,
      Microbials,
      Mycotoxins,
      HeavyMetals,
      User,
      State,
      Country,
      ConsumptionFrequency,
      Physiques,
      Strain,
      ConsumptionReason,
      Article,
      ArticleCategories,
      Diary,
      Contacts,
      Partner,
      Feedback,
      FaqCategory,
      Faq,
      Video,
      FavouriteVideo,
      VideoComments,
      UserBlocked,
      Product,
      ProductType,
      CoaJobStatus,
      Coa,
      SearchLogs,
      CommunityQuestion,
      CommunityQuestionCategory,
      FavouriteCommunityQuestion,
      CommunityComments,
      CoaJobStatus,
      Effects,
      Symptoms,
      Activity,
      Conditions,
      Cannabinoids,
      CmsPages,
      ChemicalCompound,
      ConsumptionNegative,
      FavouriteEntry,
      EntryComments,
      UserSymptoms,
      UserActivities,
      UserEffects,
      UserConditions,
      UserCannabinoids,
      BannerAdvertisement,
      Moods,
      SettingsMyEntourage,
      UserComments,
      ConsumptionMethod,
      Advertisement,
      Campaign,
      TerpenesProfile,
      UserActualEffects,
      UserPreActivities,
      UserPreConditions,
      UserPreSymptoms,
      UserDesiredEffects,
      UserPreEffects,
      UserDesiredActivities,
      UserDesiredSymptoms,
      UserDesiredConditions,
      UserActualConditions,
      UserActualActivities,
      UserActualSymptoms,
      UserMidPointEffects,
      UserMidPointActivities,
      UserMidPointSymptoms,
      UserMidPointConditions,
      MeasurementUnits,
      MeasurementScales,
      ReportReason,
      ReportPublicEntries,
      ReportQuestion,
      ReportedComment,
      ReportVideo,
      UserNegativeConsumption,
    ]),
    ConfigModule,
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, AwsService],
})
export class UserModule {}
