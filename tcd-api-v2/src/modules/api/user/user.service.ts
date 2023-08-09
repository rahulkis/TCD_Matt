import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../entity/user.entity';
import {
  Between,
  Like,
  Repository,
  IsNull,
  Not,
  In,
  MoreThanOrEqual,
  LessThanOrEqual,
  LessThan,
} from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  convertMinsToHrsMins,
  dynamicSort,
  formatedDate,
  getExcerpt,
  getWeekNumber,
  roundUp,
} from '../../../helpers/common.helper';
import {
  sendWelcomeEmail,
  twoFactorMail,
  sendContactEmail,
  contactSupportEmail,
  sendFeedbackEmail,
  sendCommunityQuestionMail,
} from '../../../helpers/mail.helper';
import { sendPush } from '../../../helpers/notify.helper';
import { sendSMS } from '../../../helpers/sms.helper';
import { Country } from '../../../entity/country.entity';
import { State } from '../../../entity/state.entity';
import { Article } from '../../../entity/article.entity';
import randomstring from 'randomstring';
import { Partner } from '../../../entity/partner.entity';
import { ArticleCategories } from '../../../entity/articlecategory.entity';
import { Diary } from '../../../entity/diary.entity';
import { Contacts } from '../../../entity/contact.entity';
import { Feedback } from '../../../entity/feedback.entity';
import bcrypt from 'bcryptjs';
import { FaqCategory } from '../../../entity/faqcategory.entity';
import { Faq } from '../../../entity/faq.entity';
import { Video } from '../../../entity/video.entity';
import { FavouriteVideo } from '../../../entity/favouritevideo.entity';
import { UserBlocked } from '../../../entity/blocked-user.entity';
import { ProductType } from '../../../entity/product-type.entity';
import { VideoComments } from '../../../entity/video_comments.entity';
import { AwsService } from '../../../services/aws-service';
import { CoaJobStatus } from '../../../entity/coajobstatus.entity';
import { Coa } from '../../../entity/coa.entity';
import { SearchLogs } from '../../../entity/search-logs.entity';
import { CommunityQuestion } from '../../../entity/community-question.entity';
import { CommunityQuestionCategory } from '../../../entity/community-question-category.entity';
import { FavouriteCommunityQuestion } from '../../../entity/favourite_community_question.entity';
import { CmsPages } from '../../../entity/cmspages.entity';
import { Composition } from '../../../entity/composition.entity';
import { Product } from '../../../entity/product.entity';
import { ChemicalCompound } from '../../../entity/chemical-compound.entity';
import { EntryComments } from '../../../entity/diary-entry-comments';
import { UserSymptoms } from '../../../entity/user-symptoms.entity';
import { UserEffects } from '../../../entity/user-effects.entity';
import { UserConditions } from '../../../entity/user-conditions.entity';
import { UserActivities } from '../../../entity/user-activities.entity';
import { UserCannabinoids } from '../../../entity/user-cannabinoids.entity';
import { BannerAdvertisement } from '../../../entity/banneradvertisement.entity';
import { Cannabinoids } from '../../../entity/cannabinoids.entity';
import { Activity } from '../../../entity/activities.entity';
import { Conditions } from '../../../entity/conditions';
import { Symptoms } from '../../../entity/symptoms.entity';
import { Effects } from '../../../entity/effects.entity';
import { ConsumptionNegative } from '../../../entity/consumptionnegative.entity';
import { ConsumptionFrequency } from '../../../entity/consumptionfrequency.entity';
import { ConsumptionReason } from '../../../entity/consumptionreason.entity';
import { Strain } from '../../../entity/strain.entity';
import { Moods } from '../../../entity/mood.entity';
import { SettingsMyEntourage } from '../../../entity/settings-my-entourage';
import { UserPreSymptoms } from '../../../entity/user-presymptoms';
import { UserDesiredEffects } from '../../../entity/user-desiredeffects';
import { UserActualEffects } from '../../../entity/user-actualeffects';
import { UserPreActivities } from '../../../entity/user-preactivities';
import { UserPreConditions } from '../../../entity/user-preconditions';
import { CannabinoidProfile } from '../../../entity/cannabinoid-profile.entity';
import { TerpenesProfile } from '../../../entity/terpenes-profile.entity';
import { Advertisement } from '../../../entity/advertisement.entity';
import { ConsumptionMethod } from '../../../entity/consumption-method.entity';
import { ReportReason } from '../../../entity/reportreason.entity';
import { ReportPublicEntries } from '../../../entity/report-public-entries.entity';
import { ReportQuestion } from '../../../entity/report-question.entity';
import { CommunityComments } from '../../../entity/community_comments';
import { ReportedComment } from '../../../entity/reported-comment.entity';
import { ReportVideo } from '../../../entity/report-video.entity';
import { UserNegativeConsumption } from '../../../entity/user-consumptionnegative.entity';
import { UserDesiredActivities } from '../../../entity/user-desiredactivities.entity';
import { UserDesiredSymptoms } from '../../../entity/user-desiredsymptoms.entity';
import { UserDesiredConditions } from '../../../entity/user-desiredconditions.entity';
import { UserActualActivities } from '../../../entity/user-actualactivities.entity';
import { UserActualSymptoms } from '../../../entity/user-actualsymptoms.entity';
import { UserActualConditions } from '../../../entity/user-actualconditions.entity';
import { UserMidPointEffects } from '../../../entity/user-midpointeffects.entity';
import { UserMidPointActivities } from '../../../entity/user-midpointactivities.entity';
import { UserMidPointSymptoms } from '../../../entity/user-midpointsymptoms.entity';
import { UserMidPointConditions } from '../../../entity/user-midpointconditions.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private readonly awsService: AwsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
    @InjectRepository(Contacts)
    private readonly contactRepository: Repository<Contacts>,
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(ArticleCategories)
    private readonly articleCategoriesRepository: Repository<ArticleCategories>,
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    @InjectRepository(Faq)
    private readonly faqRepository: Repository<Faq>,
    @InjectRepository(FaqCategory)
    private readonly faqCategoryRepository: Repository<FaqCategory>,
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @InjectRepository(VideoComments)
    private readonly videoCommentRepository: Repository<VideoComments>,
    @InjectRepository(FavouriteVideo)
    private readonly favVideoRepository: Repository<FavouriteVideo>,
    @InjectRepository(UserBlocked)
    private readonly blockedUserRepository: Repository<UserBlocked>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductType)
    private readonly productTypeSchema: Repository<ProductType>,
    @InjectRepository(CoaJobStatus)
    private readonly coaJobStatusRepository: Repository<CoaJobStatus>,
    @InjectRepository(Coa)
    private readonly coaRepository: Repository<Coa>,
    @InjectRepository(SearchLogs)
    private readonly searchLogsRepository: Repository<SearchLogs>,
    @InjectRepository(CommunityQuestion)
    private readonly communityQuestionRepository: Repository<CommunityQuestion>,
    @InjectRepository(CommunityQuestionCategory)
    private readonly communityQuestionCategoryRepository: Repository<CommunityQuestionCategory>,
    @InjectRepository(CommunityComments)
    private readonly communityCommentsRepository: Repository<CommunityComments>,
    @InjectRepository(FavouriteCommunityQuestion)
    private readonly favouriteQuestionRepository: Repository<FavouriteCommunityQuestion>,
    @InjectRepository(CmsPages)
    private readonly cmsPageRepository: Repository<CmsPages>,
    @InjectRepository(Composition)
    private readonly compositionRepository: Repository<Composition>,
    @InjectRepository(EntryComments)
    private readonly diaryCommentsRepository: Repository<EntryComments>,
    @InjectRepository(ChemicalCompound)
    private readonly chemicalCompountRepository: Repository<ChemicalCompound>,
    @InjectRepository(UserSymptoms)
    private readonly userSymptomRepository: Repository<UserSymptoms>,
    @InjectRepository(UserEffects)
    private readonly userEffectsRepository: Repository<UserEffects>,
    @InjectRepository(UserConditions)
    private readonly userConditionsRepository: Repository<UserConditions>,
    @InjectRepository(UserActivities)
    private readonly userActivitesRepository: Repository<UserActivities>,
    @InjectRepository(UserCannabinoids)
    private readonly userCannabinoidsRepository: Repository<UserCannabinoids>,
    @InjectRepository(BannerAdvertisement)
    private readonly bannerAdvertisementRepository: Repository<BannerAdvertisement>,
    @InjectRepository(Cannabinoids)
    private readonly cannabinoidRepository: Repository<Cannabinoids>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(Conditions)
    private readonly conditionRepository: Repository<Conditions>,
    @InjectRepository(Symptoms)
    private readonly symptomsRepository: Repository<Symptoms>,
    @InjectRepository(Effects)
    private readonly effectsRepository: Repository<Effects>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(ConsumptionNegative)
    private readonly consumptionNegativeRepository: Repository<ConsumptionNegative>,
    @InjectRepository(ConsumptionFrequency)
    private readonly consumptionFrequencyRepository: Repository<ConsumptionFrequency>,
    @InjectRepository(ConsumptionReason)
    private readonly consumptionReasonRepository: Repository<ConsumptionReason>,
    @InjectRepository(Strain)
    private readonly strainRepository: Repository<Strain>,
    @InjectRepository(Moods)
    private readonly moodsRepository: Repository<Moods>,
    @InjectRepository(SettingsMyEntourage)
    private readonly settingsMyEntourageRepository: Repository<SettingsMyEntourage>,
    @InjectRepository(UserPreSymptoms)
    private readonly preSymptomsRepository: Repository<UserPreSymptoms>,
    @InjectRepository(UserDesiredEffects)
    private readonly desiredEffectsRepository: Repository<UserDesiredEffects>,
    @InjectRepository(UserDesiredActivities)
    private readonly desiredActivitiesRepository: Repository<UserDesiredActivities>,
    @InjectRepository(UserDesiredSymptoms)
    private readonly desiredSymptomsRepository: Repository<UserDesiredSymptoms>,
    @InjectRepository(UserDesiredConditions)
    private readonly desiredConditionRepository: Repository<UserDesiredConditions>,
    @InjectRepository(UserActualActivities)
    private readonly actualActivitiesRepository: Repository<UserActualActivities>,
    @InjectRepository(UserActualSymptoms)
    private readonly actualSymptomsRepository: Repository<UserActualSymptoms>,
    @InjectRepository(UserActualConditions)
    private readonly actualConditionsRepository: Repository<UserActualConditions>,
    @InjectRepository(UserMidPointEffects)
    private readonly midPointEffectsRepository: Repository<UserMidPointEffects>,
    @InjectRepository(UserMidPointConditions)
    private readonly midPointConditionsRepository: Repository<UserMidPointConditions>,
    @InjectRepository(UserMidPointSymptoms)
    private readonly midPointSymptomsRepository: Repository<UserMidPointSymptoms>,
    @InjectRepository(UserMidPointActivities)
    private readonly midPointActivitiesRepository: Repository<UserMidPointActivities>,
    @InjectRepository(UserActualEffects)
    private readonly actualEffectsRepository: Repository<UserActualEffects>,
    @InjectRepository(UserPreActivities)
    private readonly preActivitiesRepository: Repository<UserPreActivities>,
    @InjectRepository(UserPreConditions)
    private readonly preConditionRepository: Repository<UserPreConditions>,
    @InjectRepository(CannabinoidProfile)
    private readonly cannabinoidProfileRepository: Repository<CannabinoidProfile>,
    @InjectRepository(TerpenesProfile)
    private readonly terpenesProfileRepository: Repository<TerpenesProfile>,
    @InjectRepository(Advertisement)
    private readonly advertisementRepository: Repository<Advertisement>,
    @InjectRepository(ConsumptionMethod)
    private readonly consumtionMethodRepository: Repository<ConsumptionMethod>,
    @InjectRepository(ReportReason)
    private readonly reportReasonRepository: Repository<ReportReason>,
    @InjectRepository(ReportPublicEntries)
    private readonly reportPublicEntryRepository: Repository<ReportPublicEntries>,
    @InjectRepository(ReportQuestion)
    private readonly reportQuestionRepository: Repository<ReportQuestion>,
    @InjectRepository(ReportedComment)
    private readonly reportedCommentRepository: Repository<ReportedComment>,
    @InjectRepository(ReportVideo)
    private readonly reportVideoRepository: Repository<ReportVideo>,
    @InjectRepository(UserNegativeConsumption)
    private readonly userNegativeConsumptionRepository: Repository<UserNegativeConsumption>,
  ) {}

  public async findUserById(id: any): Promise<any> {
    return await this.userRepository.findOne({ where: { id } });
  }

  public async signUp(user: any, res): Promise<any> {
    try {
      const {
        email,
        device_id,
        symptom,
        effects,
        activities,
        conditions,
        cannabinoids,
        password,
      } = user;
      const checkUserEmail = await this.userRepository.findOne({
        where: { email },
      });
      if (checkUserEmail) {
        return res.send({
          success: false,
          status: 0,
          message: 'Email already exist',
        });
      }
      if (device_id) {
        const deviceId = device_id;
        delete user.device_id;
        user.device_ids = [deviceId];
      }
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);

      user.password = hashPassword;
      //saving user detail
      const userDetails = await this.userRepository.save(user);

      //saving user symtoms
      if (symptom) {
        const user_symptoms = [];
        for (const symp of symptom) {
          user_symptoms.push({
            user_id: userDetails.id,
            symptom_id: symp.symptom_id,
          });
        }
        await this.userSymptomRepository.save(user_symptoms);
      }

      //saving user effects
      if (effects) {
        const user_effects = [];
        for (const eff of effects) {
          user_effects.push({
            user_id: userDetails.id,
            effect_id: eff.effect_id,
          });
        }
        await this.userEffectsRepository.save(user_effects);
      }

      //saving user activites
      if (activities) {
        const user_activities = [];
        for (const act of activities) {
          user_activities.push({
            user_id: userDetails.id,
            activity_id: act.activity_id,
          });
        }
        await this.userActivitesRepository.save(user_activities);
      }

      //saving user conditions
      if (conditions) {
        const user_conditions = [];
        for (const cond of conditions) {
          user_conditions.push({
            user_id: userDetails.id,
            condition_id: cond.condition_id,
          });
        }
        await this.userConditionsRepository.save(user_conditions);
      }

      //saving user cannabinoids
      if (cannabinoids) {
        const user_cannabinoids = [];
        for (const can of cannabinoids) {
          user_cannabinoids.push({
            user_id: userDetails.id,
            cannabinoids_id: can.cannabinoid_id,
          });
        }
        await this.userCannabinoidsRepository.save(user_cannabinoids);
      }

      const userInfo = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id: user.id })
        .select([
          'user.email',
          'user.full_name',
          'user.profile_image',
          'user.contact_no',
          'user.user_type',
          'user.gender',
          'user.dob',
          'user.city',
          'user.address',
          'user.zipcode',
          'user.is_active',
          'user.show_tutorial_flag',
          'user.device_type',
          'user.device_push_key',
          'user.height',
          'user.height_scale',
          'user.weight',
          'user.weight_scale',
          'user.activity_level',
          'user.twoFA_is_on',
        ])
        .leftJoin('user.state', 'state')
        .addSelect(['state.name', 'state.id'])
        .leftJoin('user.country', 'country')
        .addSelect(['country.name', 'country.id'])
        .leftJoin('user.cannabis_consumption', 'cannabis_consumption')
        .addSelect(['cannabis_consumption.id', 'cannabis_consumption.name'])
        .leftJoin('user.physique', 'physique')
        .addSelect(['physique.name', 'physique.id'])
        .leftJoin('user.favourite_strains', 'favourite_strains')
        .addSelect(['favourite_strains.id', 'favourite_strains.name'])
        .leftJoinAndSelect('user.symptoms', 'symptoms')
        .leftJoin('symptoms.symptom', 'user_symptoms')
        .addSelect(['user_symptoms.id', 'user_symptoms.name'])
        .leftJoinAndSelect('user.effect', 'effect')
        .leftJoin('effect.effect', 'user_effect')
        .addSelect(['user_effect.id', 'user_effect.name'])
        .leftJoinAndSelect('user.activities', 'activities')
        .leftJoin('activities.activity', 'user_activity')
        .addSelect(['user_activity.id', 'user_activity.name'])
        .leftJoinAndSelect('user.condition', 'condition')
        .leftJoin('condition.conditions', 'user_condition')
        .addSelect(['user_condition.id', 'user_condition.name'])
        .leftJoinAndSelect('user.cannabinoids', 'cannabinoids')
        .leftJoin('cannabinoids.cannabinoids', 'user_cannabinoids')
        .addSelect(['user_cannabinoids.id', 'user_cannabinoids.name'])
        .getOne();

      let userDetail = new Object(userInfo);

      userDetail['profile_image'] = userInfo.profile_image
        ? 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/profile_image/' +
          userInfo.profile_image
        : '';
      if (userInfo.dob) {
        userDetail['dob'] = formatedDate(userInfo.dob, 7);
      }
      if (userInfo.state) {
        userDetail['state'] = userInfo.state.id;
        userDetail['state_name'] = userInfo.state.name;
        userDetail['country'] = userInfo.state.country.id;
        userDetail['country_name'] = userInfo.state.country.name;
      }
      userDetail['cannabis_consumption_id'] = '';
      userDetail['cannabis_consumption'] = '';
      if (userInfo.cannabis_consumption) {
        userDetail['cannabis_consumption_id'] =
          userInfo.cannabis_consumption.id;
        userDetail['cannabis_consumption'] = userInfo.cannabis_consumption.name;
      }
      userDetail['favourite_strains_id'] = '';
      userDetail['favourite_strains'] = '';
      if (userInfo.favourite_strains) {
        userDetail['favourite_strains_id'] = userInfo.favourite_strains.id;
        userDetail['favourite_strains'] = userInfo.favourite_strains.name;
      }
      if (userInfo.physique) {
        userDetail['physique_id'] = userInfo.physique.id;
        userDetail['physique'] = userInfo.physique.name;
      }

      if (userInfo.symptoms) {
        let symptoms = [];
        for (let i = 0; i < userInfo.symptoms.length; i++) {
          symptoms.push({
            symptom_id: userInfo.symptoms[i].symptom.id,
            symptom_name: userInfo.symptoms[i].symptom.name,
          });
        }
        userDetail['symptoms'] = symptoms;
      }

      if (userInfo.effect) {
        let effects = [];
        for (let i = 0; i < userInfo.effect.length; i++) {
          effects.push({
            effect_id: userInfo.effect[i].effect.id,
            effect_name: userInfo.effect[i].effect.name,
          });
        }
        userDetail['effects'] = effects;
      }

      if (userInfo.cannabinoids) {
        let cannabinoids = [];
        for (let i = 0; i < userInfo.cannabinoids.length; i++) {
          cannabinoids.push({
            cannabinoid_id: userInfo.cannabinoids[i].cannabinoids.id,
            cannabinoid_name: userInfo.cannabinoids[i].cannabinoids.name,
          });
        }
        userDetail['cannabinoids'] = cannabinoids;
      }
      if (userInfo.activities) {
        let activities = [];
        for (let i = 0; i < userInfo.activities.length; i++) {
          activities.push({
            activity_id: userInfo.activities[i].activity.id,
            activity_name: userInfo.activities[i].activity.name,
          });
        }
        userDetail['activities'] = activities;
      }
      if (userInfo.condition) {
        let conditions = [];
        for (var i = 0; i < userInfo.condition.length; i++) {
          conditions.push({
            conditions_id: userInfo.condition[i].conditions.id,
            conditions_name: userInfo.condition[i].conditions.name,
          });
        }
        userDetail['conditions'] = conditions;
      }

      const has_incomplete_entry = false;
      const entry_id = '';
      const token = await this.createToken(userDetails);
      /**WELCOME EMAIL */
      let emailData = {
        email: userDetails.email,
        name: userDetails.full_name,
        //code:OTP
      };
      sendWelcomeEmail(emailData);

      if (userDetails.contact_no) {
        var contactNO = userDetails.contact_no.replace(/[()\-]/g, '');
        var contact_no = contactNO.replace(/ /g, '');
        sendSMS(contact_no);
      }
      /**WELCOME EMAIL */
      res.send({
        success: true,
        data: { user: userDetail, token, has_incomplete_entry, entry_id },
        message: 'You have registered successfully',
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async login(body: any, res): Promise<any> {
    try {
      const email = body.email.toLowerCase().trim();
      const password = body.password;
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .getOne();

      if (!user) {
        return res.send({
          success: false,
          data: {},
          message: 'Please check your email and password',
        });
      }

      if (user.user_type == 1) {
        throw new HttpException(
          'Admin credentials can not be used for user login',
          HttpStatus.OK,
        );
      }

      // const isMatch = await bcrypt.compare(password, user.password);
      // if (!isMatch) {
      //   throw new HttpException('Invalid login credentials', HttpStatus.OK);
      // }
      let isDeactivated = false;
      if (user.is_active == 4) {
        isDeactivated = true;
        const deactivatedOn = formatedDate(user.deactivated_at, 7);
        return res.send({
          success: true,
          data: {
            is_deactivated: isDeactivated,
            deactivated_on: deactivatedOn,
          },
          message: `You have deactivated your account on ${deactivatedOn} . To use the TCD app, you will need to activate your account again.`,
        });
      }
      if (user.is_active == 0) {
        return res.send({
          success: false,
          data: { is_deactivated: isDeactivated },
          message: 'Your account has blocked by administrator',
        });
      }
      if (user.is_active == 3) {
        return res.send({
          success: true,
          data: { is_deactivated: isDeactivated, is_active: user.is_active },
          message: 'Please verify your email',
        });
      }
      const token = await this.createToken(user);

      user.device_type = body.device_type;
      if (body.device_push_key != undefined) {
        user.device_push_key = body.device_push_key;
      }
      if (body.device_id) {
        const deviceId = body.device_id;
        const existingDeviceIds = [];
        if (user.device_ids.length > 0) {
          for (let d = 0; d < user.device_ids.length; d++) {
            existingDeviceIds.push(user.device_ids[d]);
          }
          const check = existingDeviceIds.includes(deviceId);
          if (!check) {
            user.device_ids.push(deviceId);
          }
        } else {
          user.device_ids.push(deviceId);
        }
      }
      /** 2FA*/
      if (user.twoFA_is_on == 1) {
        const OTP = await randomstring.generate({
          length: 6,
          charset: 'alphanumeric',
          capitalization: 'uppercase',
        });
        const emailData = {
          email: user.email,
          name: user.full_name,
          code: OTP,
        };
        twoFactorMail(emailData);

        if (user.contact_no) {
          const contactNO = user.contact_no.replace(/[()\-]/g, '');
          const contact_no = contactNO.replace(/ /g, '');
          sendSMS(contact_no)
        }
        user.twoFA_verification_code = OTP;
      }

      /** 2FA*/
      await this.userRepository.save(user);

      const userInfo = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id: user.id })
        .select([
          'user.email',
          'user.full_name',
          'user.profile_image',
          'user.contact_no',
          'user.user_type',
          'user.gender',
          'user.dob',
          'user.city',
          'user.address',
          'user.zipcode',
          'user.is_active',
          'user.show_tutorial_flag',
          'user.device_type',
          'user.device_push_key',
          'user.height',
          'user.height_scale',
          'user.weight',
          'user.weight_scale',
          'user.activity_level',
          'user.twoFA_is_on',
        ])
        .leftJoin('user.state', 'state')
        .addSelect(['state.name', 'state.id'])
        .leftJoin('user.country', 'country')
        .addSelect(['country.name', 'country.id'])
        .leftJoin('user.cannabis_consumption', 'cannabis_consumption')
        .addSelect(['cannabis_consumption.id', 'cannabis_consumption.name'])
        .leftJoin('user.physique', 'physique')
        .addSelect(['physique.name', 'physique.id'])
        .leftJoin('user.favourite_strains', 'favourite_strains')
        .addSelect(['favourite_strains.id', 'favourite_strains.name'])
        .leftJoinAndSelect('user.symptoms', 'symptoms')
        .leftJoin('symptoms.symptom', 'user_symptoms')
        .addSelect(['user_symptoms.id', 'user_symptoms.name'])
        .leftJoinAndSelect('user.effect', 'effect')
        .leftJoin('effect.effect', 'user_effect')
        .addSelect(['user_effect.id', 'user_effect.name'])
        .leftJoinAndSelect('user.activities', 'activities')
        .leftJoin('activities.activity', 'user_activity')
        .addSelect(['user_activity.id', 'user_activity.name'])
        .leftJoinAndSelect('user.condition', 'condition')
        .leftJoin('condition.conditions', 'user_condition')
        .addSelect(['user_condition.id', 'user_condition.name'])
        .leftJoinAndSelect('user.cannabinoids', 'cannabinoids')
        .leftJoin('cannabinoids.cannabinoids', 'user_cannabinoids')
        .addSelect(['user_cannabinoids.id', 'user_cannabinoids.name'])
        .getOne();

      let userDetails = new Object(userInfo);

      userDetails['profile_image'] = userInfo.profile_image
        ? 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/profile_image/' +
          userInfo.profile_image
        : '';
      if (userInfo.dob) {
        userDetails['dob'] = formatedDate(userInfo.dob, 7);
      }
      if (userInfo.state) {
        userDetails['state'] = userInfo.state.id;
        userDetails['state_name'] = userInfo.state.name;
        userDetails['country'] = userInfo.state.country.id;
        userDetails['country_name'] = userInfo.state.country.name;
      }
      userDetails['cannabis_consumption_id'] = '';
      userDetails['cannabis_consumption'] = '';
      if (userInfo.cannabis_consumption) {
        userDetails['cannabis_consumption_id'] =
          userInfo.cannabis_consumption.id;
        userDetails['cannabis_consumption'] =
          userInfo.cannabis_consumption.name;
      }
      userDetails['favourite_strains_id'] = '';
      userDetails['favourite_strains'] = '';
      if (userInfo.favourite_strains) {
        userDetails['favourite_strains_id'] = userInfo.favourite_strains.id;
        userDetails['favourite_strains'] = userInfo.favourite_strains.name;
      }
      if (userInfo.physique) {
        userDetails['physique_id'] = userInfo.physique.id;
        userDetails['physique'] = userInfo.physique.name;
      }

      if (userInfo.symptoms) {
        let symptoms = [];
        for (let i = 0; i < userInfo.symptoms.length; i++) {
          symptoms.push({
            symptom_id: userInfo.symptoms[i].symptom.id,
            symptom_name: userInfo.symptoms[i].symptom.name,
          });
        }
        userDetails['symptoms'] = symptoms;
      }

      if (userInfo.effect) {
        let effects = [];
        for (let i = 0; i < userInfo.effect.length; i++) {
          effects.push({
            effect_id: userInfo.effect[i].effect.id,
            effect_name: userInfo.effect[i].effect.name,
          });
        }
        userDetails['effects'] = effects;
      }

      if (userInfo.cannabinoids) {
        let cannabinoids = [];
        for (let i = 0; i < userInfo.cannabinoids.length; i++) {
          cannabinoids.push({
            cannabinoid_id: userInfo.cannabinoids[i].cannabinoids.id,
            cannabinoid_name: userInfo.cannabinoids[i].cannabinoids.name,
          });
        }
        userDetails['cannabinoids'] = cannabinoids;
      }
      if (userInfo.activities) {
        let activities = [];
        for (let i = 0; i < userInfo.activities.length; i++) {
          activities.push({
            activity_id: userInfo.activities[i].activity.id,
            activity_name: userInfo.activities[i].activity.name,
          });
        }
        userDetails['activities'] = activities;
      }
      if (userInfo.condition) {
        let conditions = [];
        for (var i = 0; i < userInfo.condition.length; i++) {
          conditions.push({
            conditions_id: userInfo.condition[i].conditions.id,
            conditions_name: userInfo.condition[i].conditions.name,
          });
        }
        userDetails['conditions'] = conditions;
      }

      //check incomplete entries
      let has_incomplete_entry = false;
      let entry_id;
      const incompleteEntry = await this.diaryRepository.findOne({
        where: {
          has_incompleteness_notified: 2,
          is_complete: 2,
          user_id: user.id,
        },
      });
      if (incompleteEntry) {
        has_incomplete_entry = true;
        entry_id = incompleteEntry.id;
        if (user.device_push_key) {
          sendPush(user.device_push_key, 'Please complete your entry', '1');
        }
      }

      res.send({
        success: true,
        message: 'You have logged in successfully',
        data: {
          userDetails,
          token,
          has_incomplete_entry,
          entry_id,
          is_deactivated: isDeactivated,
        },
      });
    } catch (error) {
      console.log({ error });
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async forgotPassword(body: any, res): Promise<any> {
    try {
      const { email } = body;
      if (!email) {
        return res.send({
          success: false,
          status: 0,
          message: 'Please provide email',
        });
      }
      const user = await this.userRepository.findOne({
        where: { email: email.trim() },
      });
      if (!user) {
        return res.send({
          success: false,
          status: 0,
          message: 'User does not exist',
        });
      }
      const currentDate = formatedDate(new Date(), 7);
      if (
        user.reset_password_attempted_on == new Date(currentDate) &&
        user.reset_password_attempted >= 3
      ) {
        return res.send({
          success: false,
          message: 'Max number of attempt has been exceeded',
        });
      }
      // const OTP = await randomstring.generate({
      //   length: 6,
      //   charset: 'alphanumeric',
      //   capitalization: 'uppercase',
      // });
      // partner.reset_password_otp = OTP;
      user.reset_password_otp = 'tcd';

      if (user.reset_password_attempted_on == new Date(currentDate))
        user.reset_password_attempted = user.reset_password_attempted + 1;
      else user.reset_password_attempted = 1;

      user.reset_password_attempted_on = new Date();
      await this.userRepository.save(user);
      // const emailData = {
      //   email: partner.email,
      //   name: partner.full_name,
      //   OTP,
      // };
      // sendForgotPasswordEmail(emailData);

      res.send({
        success: true,
        status: 1,
        message: 'A reset password OTP has been sent to you registered email',
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async resetPassword(body: any, res): Promise<any> {
    try {
      const { email, otp, password } = body;
      if (!email) {
        return res.send({ success: false, message: 'Please provide email' });
      }
      if (!otp) {
        return res.send({
          success: false,
          message: 'Please provide reset password OTP',
        });
      }
      if (!password) {
        return res.send({ success: false, message: 'Please provide password' });
      }
      const checkUser = await this.userRepository.findOne({
        where: { email: email.trim() },
      });
      if (!checkUser) {
        return res.send({ success: false, message: 'Partner does not exist' });
      }
      if (checkUser.reset_password_otp != otp) {
        return res.send({
          success: false,
          message: 'It seems that you have entered wrong OTP',
        });
      }

      checkUser.reset_password_otp = '';
      checkUser.reset_password_attempted = 0;
      checkUser.password = password;

      await this.userRepository.save(checkUser);
      res.send({
        success: true,
        message: 'Your password has been changed',
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getStateList(country_id: any, res): Promise<any> {
    try {
      const stateFindCond = { is_deleted: false, is_active: true };
      if (country_id) {
        stateFindCond['country'] = country_id;
      }
      const states = await this.stateRepository
        .createQueryBuilder('states')
        .where(stateFindCond)
        .getMany();
      res.send({ success: true, message: '', data: { states } });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getAllStates(res): Promise<any> {
    try {
      const stateFindCond = { is_deleted: false, is_active: true };
      const states = await this.stateRepository.find({
        where: stateFindCond,
        select: ['name', 'local_name'],
      });
      res.send({
        success: true,
        message: 'Your states list',
        states,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getArticlesList(page: any, res): Promise<any> {
    try {
      const limit = 10;
      const page_no = parseInt(page);
      let total = 0;
      let skip = 0;
      let totalPages = 0;
      if (page_no && page_no > 0) {
        skip = (page_no - 1) * limit;
      }
      const findCond = { is_active: true, is_deleted: false };
      total = await this.articleRepository.count({ where: findCond });
      if (total == 0) {
        return res.send({ success: false, message: 'No records available' });
      }

      totalPages = Math.ceil(total / limit);
      const articlesList = await this.articleRepository.find({
        where: findCond,
        take: limit,
        skip,
      });

      const articles = [];
      if (articlesList.length > 0) {
        const imagePath =
          'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/article/';
        for (const article of articlesList) {
          articles.push({
            article_id: article.id,
            title: article.title,
            excerpt: getExcerpt(article.content, 150),
            content: article.content,
            image: article.image ? imagePath + article.image : '',
            created_at: formatedDate(article.created_at, 7),
          });
        }
      }

      res.send({
        success: true,
        articles,
        total,
        record_per_page: limit,
        total_pages: totalPages,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async logOut(req, res): Promise<any> {
    try {
      const user = req.user;
      const userDetails = await this.userRepository.findOne({
        where: { id: user.id },
      });
      userDetails.token = '';
      userDetails.device_type = 0;
      userDetails.device_push_key = '';
      await this.userRepository.save(userDetails);
      res.send({ success: true, status: 1, message: 'Logout successfully' });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async contactSupport(req, body: any, res): Promise<any> {
    try {
      const user = req.user;
      const userId = user.id;
      const contact = {
        user: userId,
        topic: body.topic,
        issue: body.issue,
      };
      await this.contactRepository.save(contact);
      /**CONTACT EMAIL */
      const emailData = {
        name: user.full_name,
        email: body.email,
        topic: body.topic,
        issue: body.issue,
      };
      sendContactEmail(emailData);
      contactSupportEmail(emailData);
      /**CONTACT EMAIL */
      res.send({ success: true, message: 'Contacted successfully' });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendFeedback(body: any, res: any): Promise<any> {
    // async sendFeedback(body: any, res: any, req: any): Promise<any> {
    try {
      const { area_of_improvement, feedback, userId, email } = body;
      // const userId = req.user._id
      if (!area_of_improvement) {
        return res.send({
          success: false,
          message: 'Page provide area of improvement',
        });
      }
      if (!feedback) {
        return res.send({ success: false, message: 'Page provide feedback' });
      }

      await this.feedbackRepository.save({
        user: userId,
        area_of_improvement: area_of_improvement,
        feedback: feedback,
      });

      const emailData = {
        email: email,
      };

      sendFeedbackEmail(emailData);

      res.send({ success: true, message: 'Feedback sent successfully' });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changePassword(body: any, res: any): Promise<any> {
    // async changePassword(body: any, res: any, req: any): Promise<any> {
    try {
      const { old_password, new_password, userId } = body;

      if (!old_password)
        return res.send({
          success: false,
          message: 'Please provide old password',
        });

      if (!new_password)
        return res.send({
          success: false,
          message: 'Please provide new password',
        });

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new HttpException('User does not exist', HttpStatus.OK);
      }

      const isMatchpass = await bcrypt.compare(old_password, user.password);
      if (!isMatchpass)
        throw new HttpException('Invalid Old Password', HttpStatus.OK);

      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(body.password, salt);

      user.password = hashPassword;
      await this.userRepository.save(user);

      res.send({ success: true, message: 'Password updated successfully' });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getFAQ(res): Promise<any> {
    try {
      const faqCond = { is_deleted: false, is_active: true, parent_id: null };
      const faqCategoryData = await this.faqCategoryRepository.find({
        where: faqCond,
      });
      const tempArray1 = [];
      for (const fCat of faqCategoryData) {
        const faqCatData = await this.faqRepository
          .createQueryBuilder('faq')
          .where({ is_deleted: false, is_active: true, category_id: fCat.id })
          .leftJoin('faq.category_id', 'category')
          .addSelect(['question', 'answer'])
          .getMany();
        const subCategories = await this.faqCategoryRepository.find({
          where: { is_deleted: false, is_active: true, parent_id: fCat.id },
        });
        const tempArray2 = [];
        for (const fSub of subCategories) {
          const faqData = await this.faqRepository
            .createQueryBuilder('faq')
            .where({ is_deleted: false, is_active: true, category_id: fCat.id })
            .leftJoin('faq.category_id', 'category')
            .addSelect(['question', 'answer'])
            .getMany();
          tempArray2.push({
            sub_category_name: fSub.name,
            question_answer: faqData,
          });
        }
        const fCatObj = {
          category_name: fCat.name,
          subcategories: tempArray2,
          question_answer: faqCatData,
        };
        tempArray1.push(fCatObj);
      }
      res.send({ success: true, data: { faqs: tempArray1 } });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getVideos(req, res): Promise<any> {
    try {
      const user = req.user;
      const uploadDirPath =
        'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/';
      //get favourite videos
      const favVideos = await this.favVideoRepository.find({
        where: { user_id: user.id, is_favourite: 1 },
      });
      let favVideoIds = [];
      for (const video of favVideos) {
        const favVideoId = video.video_id;
        favVideoIds.push(favVideoId);
      }
      //get disliked videos
      const dislikedVideos = await this.favVideoRepository.find({
        where: { user_id: user.id, is_favourite: 2 },
      });

      let dislikedVideoIds = [];

      for (const video of dislikedVideos) {
        const dislikedVideoId = video.video_id;
        dislikedVideoIds.push(dislikedVideoId);
      }
      const introFindCond = { is_deleted: false, is_active: true, type: 1 };
      const introVideoList = await this.videoRepository.find({
        where: introFindCond,
      });

      // console.log({introVideoList})
      // .sort({
      //   created_at: -1,
      // });
      const introvideos = [];
      for (const video of introVideoList) {
        let isFavouriteFlag = 0;
        if (favVideoIds.length > 0) {
          const isFavourite = favVideoIds.some(function (favVideo) {
            return favVideo === video.id;
          });
          if (isFavourite) {
            isFavouriteFlag = 1;
          }
        }
        if (dislikedVideoIds.length > 0) {
          const isFavourite = dislikedVideoIds.some(function (dislikedVideoId) {
            return dislikedVideoId === video.id;
          });
          if (isFavourite) {
            isFavouriteFlag = 2;
          }
        }
        introvideos.push({
          id: video.id,
          video_title: video.title,
          video_url: uploadDirPath + 'video/introductory/' + video.video_url,
          video_thumb_image:
            uploadDirPath +
            'video_thumb_image/introductory/' +
            video.video_thumb_image,
          video_duration: video.duration,
          is_favourite: isFavouriteFlag,
        });
      }
      const eduFindCond = { is_deleted: false, is_active: true, type: 2 };
      const eduVideoList = await this.videoRepository.find({
        where: eduFindCond,
      });
      // .sort({ created_at: -1 });
      const educationvideos = [];
      for (const video of eduVideoList) {
        let isFavouriteFlag = 0;
        if (favVideoIds.length > 0) {
          const isFavourite = favVideoIds.some(function (favVideo) {
            return favVideo === video.id;
          });
          if (isFavourite) {
            isFavouriteFlag = 1;
          }
        }
        if (dislikedVideoIds.length > 0) {
          const isFavourite = dislikedVideoIds.some(function (dislikedVideoId) {
            return dislikedVideoId === video.id;
          });
          if (isFavourite) {
            isFavouriteFlag = 2;
          }
        }
        educationvideos.push({
          id: video.id,
          video_title: video.title,
          video_url: uploadDirPath + 'video/educational/' + video.video_url,
          video_thumb_image:
            uploadDirPath +
            'video_thumb_image/educational/' +
            video.video_thumb_image,
          video_duration: video.duration,
          is_favourite: isFavouriteFlag,
        });
      }
      const newsFindCond = { is_deleted: false, is_active: true, type: 3 };
      const newsVideoList = await this.videoRepository.find({
        where: newsFindCond,
      });
      // .sort({
      //   created_at: -1,
      // });
      const newsvideos = [];
      for (const video of newsVideoList) {
        let isFavouriteFlag = 0;
        if (favVideoIds.length > 0) {
          const isFavourite = favVideoIds.some(function (favVideo) {
            return favVideo === video.id;
          });
          if (isFavourite) {
            isFavouriteFlag = 1;
          }
        }
        if (dislikedVideoIds.length > 0) {
          const isFavourite = dislikedVideoIds.some(function (dislikedVideoId) {
            return dislikedVideoId === video.id;
          });
          if (isFavourite) {
            isFavouriteFlag = 2;
          }
        }
        newsvideos.push({
          id: video.id,
          video_title: video.title,
          video_url: uploadDirPath + 'video/news/' + video.video_url,
          video_thumb_image:
            uploadDirPath + 'video_thumb_image/news/' + video.video_thumb_image,
          video_duration: video.duration,
          is_favourite: isFavouriteFlag,
        });
      }
      res.send({
        success: true,
        data: {
          Introduction: introvideos,
          Educational: educationvideos,
          News: newsvideos,
        },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getVideoDetails(req, res, video_id: string): Promise<any> {
    try {
      const userId = req.user.id;
      const videoId = video_id;
      const uploadDirPath =
        'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/';

      const videoInfo = await this.videoRepository.findOne({
        where: { id: videoId, is_active: true, is_deleted: false },
        relations: ['comments', 'comments.user'],
      });

      //get favourite videos
      const favVideos = await this.favVideoRepository.find({
        where: { user_id: userId, is_favourite: 1 },
      });

      const favVideoIds = [];
      for (const video of favVideos) {
        const favVideoId = video.video_id;
        favVideoIds.push(favVideoId);
      }
      //get disliked videos
      const dislikedVideos = await this.favVideoRepository.find({
        where: { user_id: userId, is_favourite: 2 },
      });

      const dislikedVideoIds = [];

      for (const video of dislikedVideos) {
        const dislikedVideoId = video.video_id;
        dislikedVideoIds.push(dislikedVideoId);
      }

      let isFavouriteFlag = 0;

      if (favVideoIds.length > 0) {
        const isFavourite = favVideoIds.some(function (favVideo) {
          return favVideo === videoInfo.id;
        });
        if (isFavourite) {
          isFavouriteFlag = 1;
        }
      }
      if (dislikedVideoIds.length > 0) {
        const isFavourite = dislikedVideoIds.some(function (dislikedVideoId) {
          return dislikedVideoId === videoInfo.id;
        });
        if (isFavourite) {
          isFavouriteFlag = 2;
        }
      }
      let videoComments = [];
      const findBlockedCond = {
        is_active: true,
        is_deleted: false,
        blocked_by: userId,
      };
      const userFind = await this.blockedUserRepository.find({
        where: findBlockedCond,
        select: ['blocked_userid'],
      });

      if (videoInfo.comments.length > 0) {
        const profileImgPath =
          'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/profile_image/';
        for (const comment of videoInfo.comments) {
          let continuenext = false;
          for (const user of userFind) {
            const blockedUserId = JSON.stringify(user.blocked_userid);
            const useridCheck = JSON.stringify(comment.user.id);
            if (blockedUserId === useridCheck) {
              continuenext = true;
            }
          }
          if (continuenext) continue;
          videoComments.push({
            comment_id: comment.id,
            commented_by: comment.user.full_name,
            commented_by_user_id: comment.user.id,
            commented_by_image: comment.user.profile_image
              ? profileImgPath + comment.user.profile_image
              : '',
            comment: comment.comment,
            created_at: formatedDate(comment.created_at, 7),
          });
        }
        videoComments = videoComments.sort(dynamicSort('created_at'));
      }
      const video = {};
      video['id'] = videoInfo.id;
      video['video_title'] = videoInfo.title;
      video['video_url'] = videoInfo.video_url
        ? uploadDirPath + 'video/community/' + videoInfo.video_url
        : '';
      video['video_thumb_image'] = videoInfo.video_thumb_image
        ? uploadDirPath +
          'video_thumb_image/community/' +
          videoInfo.video_thumb_image
        : '';
      video['video_duration'] = videoInfo.duration;
      video['comments'] = videoComments;
      video['is_favourite'] = isFavouriteFlag;
      res.send({
        success: true,
        message: 'Video information',
        data: { video },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async findProductTypesByParentId(res, parent_id: number) {
    try {
      if (parent_id) {
        const findCond = { is_deleted: 0, is_active: 1, type: 2 };

        findCond['parent_id'] = parent_id;

        const productTypes = await this.productTypeSchema.find({
          where: findCond,
        });

        return res.send({ success: true, message: '', data: { productTypes } });
      }

      const findParentTypeCondition = {
        is_deleted: 0,
        is_active: 1,
        type: 1,
      };

      const parent_types = await this.productTypeSchema.find({
        where: findParentTypeCondition,
      });

      res.send({ success: true, message: '', data: { parent_types } });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async uploadCoa(file, res): Promise<any> {
    try {
      if (file) {
        const processFile = await this.awsService.awsTextTract(file);

        if (!!processFile.success) {
          var new_coa = {
            job_id: processFile.JobId,
            filename: file.key,
            originalFilename: file.originalname,
            job_status: 'In Progress',
          };
          await this.coaJobStatusRepository
            .save(new_coa)
            .then((response) => {
              if (response) {
                //req.flash('success_msg', req.file.originalname+' has been processed with JobID ' + processFile.JobId + ' .')
                res.send({
                  success: true,
                  message:
                    file.originalname +
                    ' has been processed with JobID ' +
                    processFile.JobId +
                    ' .',
                  data: {
                    filename: file.originalname,
                    JobID: processFile.JobId,
                  },
                });
              }
            })
            .catch((err) => {
              console.log(err);
              res.send({ success: false, message: err });
            });
        } else {
          res.send({
            success: false,
            message: 'Something went wrong please contact your admin!',
          });
        }
      } else {
        res.send({
          success: false,
          message: 'Please select a file to upload',
        });
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async markFavouriteVideo(req, res, body: any): Promise<any> {
    try {
      const userId = req.user.id;
      const { video_id, is_favourite } = body;
      let success = false;
      let message = '';
      let favVideoInfo = await this.favVideoRepository.findOne({
        where: { video_id: video_id, user_id: userId },
      });
      if (favVideoInfo) {
        if (favVideoInfo.is_favourite == is_favourite) {
          if (is_favourite == 1) {
            message = 'You already have liked this video';
          } else {
            message = 'You already have disliked this video';
          }
        } else {
          favVideoInfo.is_favourite = is_favourite;
          await this.favVideoRepository.save(favVideoInfo);
          success = true;
          if (is_favourite == 1) {
            message = 'You liked this video';
          }
          if (is_favourite == 2) {
            message = 'You disliked this video';
          }
        }
      } else {
        const favVideo = {
          user_id: userId,
          video_id: video_id,
          is_favourite: is_favourite,
        };
        await this.favVideoRepository.save(favVideo);
        success = true;
        if (is_favourite == 1) {
          message = 'You liked this video';
        }
        if (is_favourite == 2) {
          message = 'You disliked this video';
        }
      }
      res.send({ success, message });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async addVideoComment(req, res, body: any): Promise<any> {
    try {
      const userId = req.user.id;
      const { video_id, comment } = body;
      const videoInfo = await this.videoRepository.findOne({
        where: { id: video_id },
      });
      if (!videoInfo) {
        return res.send({ success: false, message: 'Video does not exist' });
      }
      await this.videoCommentRepository.save({
        commented_by: userId,
        comment,
        video_id,
      });
      res.send({ success: true, message: 'Comment added successfully' });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getIntroVideos(res): Promise<any> {
    try {
      const findCond = { is_deleted: false, is_active: true, type: 1 };
      const list = await this.videoRepository.find({ where: findCond });
      let videos = [];
      const uploadDirPath =
        'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/';
      if (list.length > 0) {
        for (var i = 0; i < list.length; i++) {
          videos.push({
            id: list[i].id,
            video_title: list[i].title,
            video_url:
              uploadDirPath + 'video/introductory/' + list[i].video_url,
            video_thumb_image:
              uploadDirPath +
              'video_thumb_image/introductory/' +
              list[i].video_thumb_image,
            video_duration: list[i].duration,
          });
        }
      }
      const findTCond = { is_deleted: false, is_active: true, type: 5 };
      const tutorialVideo = await this.videoRepository.findOne({
        where: findTCond,
        select: ['title', 'video_url', 'video_thumb_image', 'duration'],
      });
      let tutorial = {};
      if (tutorialVideo) {
        const tutorialInfo = tutorialVideo;
        tutorial = {
          id: tutorialInfo.id,
          video_title: tutorialInfo.title,
          video_url:
            uploadDirPath + 'video/introductory/' + tutorialInfo.video_url,
          video_thumb_image:
            uploadDirPath +
            'video_thumb_image/introductory/' +
            tutorialInfo.video_thumb_image,
          video_duration: tutorialInfo.duration,
        };
      }
      res.send({ success: true, message: '', data: { videos, tutorial } });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getCoaInfo(req, res): Promise<any> {
    try {
      const { id: userId } = req.user;
      const { coa_number } = req.query;
      if (!coa_number) {
        return res.send({
          success: false,
          message: 'Please provide COA number',
        });
      }
      const coaNo = coa_number;
      let findCond = { is_deleted: 0, is_active: 1 };

      if (coaNo) {
        findCond[
          'coa_no' || 'coa_source' || 'coa_source2' || 'sample_id' || 'batch_id'
        ] = coaNo;
      }

      const coaInfo = await this.coaRepository
        .createQueryBuilder('coaInfo')
        .where({ is_deleted: 0, is_active: 1 })
        .leftJoin('coaInfo.product', 'product')
        .addSelect([
          'product.name',
          'product.description',
          'product.product_image',
          'product.weight',
        ])
        .leftJoin('product.product_type', 'product_type')
        .addSelect([
          'product_type.parent_id',
          'product_type.type',
          'product_type.name',
        ])
        .leftJoin('product_type.parent_id', 'parent_id')
        .addSelect(['parent_id.name'])
        .leftJoin('coaInfo.strain', 'strain')
        .addSelect(['strain.name'])
        .leftJoin('coaInfo.cannabinoid_profile', 'cannabinoid_profile')
        .leftJoin('cannabinoid_profile.composition_id', 'composition_id')
        .addSelect(['composition_id.name'])
        .leftJoin('coaInfo.terpenes', 'terpenes')
        .leftJoin('terpenes.compo_id', 'compo_id')
        .addSelect(['compo_id.name'])
        .getRawOne();
      if (!coaInfo) {
        const logEntry = {
          search_terms: coaNo,
          type: 'getCOAinformation',
          search_by: userId,
          status: 'COA does not exists',
        };

        await this.searchLogsRepository.create(logEntry);

        return res.send({
          success: false,
          message: 'Sorry ! we could not found a match with your COA number',
        });
      }
      const logEntry = {
        search_terms: coaNo,
        type: 'getCOAinformation',
        search_by: userId,
        status: 'completed',
      };

      await this.searchLogsRepository.create(logEntry);

      var prdImagePath =
        'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/product/';

      let cannabinoid_profile = [];
      if (
        !!coaInfo.cannabinoid_profile &&
        coaInfo.cannabinoid_profile.length > 0
      ) {
        for (let c = 0; c < coaInfo.cannabinoid_profile.length; c++) {
          if (
            coaInfo.cannabinoid_profile[c].weight &&
            coaInfo.cannabinoid_profile[c].weight > 0
          ) {
            cannabinoid_profile.push({
              composition_id: coaInfo.cannabinoid_profile[c].composition_id._id,
              composition_name:
                coaInfo.cannabinoid_profile[c].composition_id.name,
              weight: coaInfo.cannabinoid_profile[c].weight,
            });
          }
        }
      }
      cannabinoid_profile.sort(function (a, b) {
        return b.weight - a.weight;
      });
      let terpenes = [];
      if (!!coaInfo.terpenes && coaInfo.terpenes.length > 0) {
        for (let c = 0; c < coaInfo.terpenes.length; c++) {
          if (coaInfo.terpenes[c].weight && coaInfo.terpenes[c].weight > 0) {
            terpenes.push({
              composition_id: coaInfo.terpenes[c].composition_id._id,
              composition_name: coaInfo.terpenes[c].composition_id.name,
              weight: coaInfo.terpenes[c].weight,
            });
          }
        }
      }
      terpenes.sort(function (a, b) {
        return b.weight - a.weight;
      });
      let info = {
        id: coaInfo.id,
        coa_no: coaInfo.coa_no,
        product_id: coaInfo.product ? coaInfo.product.id : '',
        'product-types': coaInfo.product
          ? coaInfo.product.product_type.name
          : '',
        name: coaInfo.product ? coaInfo.product.name : '',
        description: coaInfo.product ? coaInfo.product.description : '',
        product_image: coaInfo.product
          ? prdImagePath + coaInfo.product.product_image
          : '',
        weight: coaInfo.product ? coaInfo.product.weight : '',
        strain_id: coaInfo.strain && coaInfo.strain.id,
        strain: coaInfo.strain && coaInfo.strain.name,
        cannabinoid_profile,
        terpenes,
        total_cannabinoid: coaInfo.total_cannabinoid,
        total_terpenes: coaInfo.total_terpenes,
        total_thc: coaInfo.total_THC ? coaInfo.total_THC : '',
        total_cbd: coaInfo.total_CBD ? coaInfo.total_CBD : '',
        laboratory_name: coaInfo.laboratory_name,
        tested_at: formatedDate(coaInfo.tested_at, 7),
        positive_test_report_text: coaInfo.positive_test_report_text,
        negative_test_report_text: coaInfo.negative_test_report_text,
      };
      res.send({ success: true, data: { coainfo: info } });
    } catch (error) {
      console.log({ error });
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async postCommunityQuestion(req, res, body: any): Promise<any> {
    try {
      // return await this.communityQuestionCategoryRepository.save({name:"test1"})
      const { id: userId, full_name } = req.user;
      const { question, category_id } = body;
      const findCategory =
        await this.communityQuestionCategoryRepository.findOne({
          where: { id: category_id },
        });
      const obj = {
        question,
        user: userId,
        category_id: category_id,
      };
      await this.communityQuestionRepository.save(obj);
      const emailObj = {
        userName: full_name,
        question: question,
        category: findCategory.name,
      };
      sendCommunityQuestionMail(emailObj);
      res.send({
        success: true,
        message: 'Your question has posted successfully',
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async markFavouriteQuestion(req, res, body: any): Promise<any> {
    try {
      const userId = req.user.id;
      const { question_id, is_favourite } = req.body;
      let success = false;
      let message = '';
      const qInfo = await this.communityQuestionRepository.findOne({
        where: { id: question_id, is_active: true },
      });
      if (!qInfo) {
        return res.send({ success: false, message: 'Question does not exist' });
      }
      const favQuestionCheck = await this.favouriteQuestionRepository.findOne({
        where: {
          question_id,
          user_id: userId,
        },
      });
      if (favQuestionCheck) {
        if (favQuestionCheck.is_favourite == is_favourite) {
          if (is_favourite == 1) {
            message = 'You already have like this question';
          } else {
            message = 'You already have disliked this question';
          }
        } else {
          favQuestionCheck.is_favourite = is_favourite;
          await this.favouriteQuestionRepository.save(favQuestionCheck);
          success = true;
          if (is_favourite == 1) {
            message = 'You like this question';
          } else {
            message = 'You dislike this question';
          }
        }
      } else {
        const favQuestion = {
          question_id,
          user_id: userId,
          is_favourite: is_favourite,
        };
        await this.favouriteQuestionRepository.save(favQuestion);
        success = true;
        if (is_favourite == 1) {
          message = 'You like this entry';
        } else {
          message = 'You dislike this entry';
        }
      }
      res.send({ success, message });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //this api need some changes according to diary table//
  public async communityInfo(req, res): Promise<any> {
    try {
      const userId = req.user.id;
      const { community_search_text } = req.query;
      const uploadDirPath =
        'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/';
      let videos = [];
      const videoList = await this.videoRepository.find({
        where: { type: 4, is_active: true, is_deleted: false },
      });
      //console.log(videoList)
      if (videoList.length > 0) {
        //get favourite videos
        const favVideos = await this.favVideoRepository.find({
          where: {
            user_id: userId,
            is_favourite: 1,
          },
        });
        //console.log(favVideos)
        let favVideoIds = [];
        if (favVideos.length > 0) {
          for (const video of favVideos) {
            const favVideoId = video.video_id;
            favVideoIds.push(favVideoId);
          }
        }

        //get disliked videos
        const dislikedVideos = await this.favVideoRepository.find({
          where: {
            user_id: userId,
            is_favourite: 2,
          },
        });
        //console.log(favVideos)
        let dislikedVideoIds = [];
        if (dislikedVideos.length > 0) {
          for (const video of dislikedVideos) {
            const dislikedVideoId = video.video_id;
            dislikedVideoIds.push(dislikedVideoId);
          }
        }
        for (const video of videoList) {
          let isFavouriteFlag = 0;
          if (favVideoIds.length > 0) {
            const isFavourite = favVideoIds.some(function (favVideo) {
              return favVideo === video.id;
            });
            if (isFavourite) {
              isFavouriteFlag = 1;
            }
          }
          if (dislikedVideoIds.length > 0) {
            const isFavourite = dislikedVideoIds.some(function (
              dislikedVideoId,
            ) {
              return dislikedVideoId === video.id;
            });
            if (isFavourite) {
              isFavouriteFlag = 2;
            }
          }
          videos.push({
            id: video.id,
            video_title: video.title,
            video_url: uploadDirPath + 'video/community/' + video.video_url,
            video_thumb_image:
              uploadDirPath +
              'video_thumb_image/community/' +
              video.video_thumb_image,
            video_duration: video.duration,
            is_favourite: isFavouriteFlag,
          });
        }
      }

      const latestPublicEntry = await this.diaryRepository
        .createQueryBuilder('diary')
        .where({
          is_public: 1,
          is_active: true,
          is_deleted: false,
          is_complete: 1,
        })
        .select(['diary.created_at'])
        .leftJoin('diary.user', 'user')
        .addSelect(['user.full_name'])
        .leftJoin('diary.product', 'product')
        .addSelect(['product.name'])
        .orderBy('diary.created_at', 'ASC')
        .getOne();

      let entry = {};
      if (latestPublicEntry) {
        entry = new Object(latestPublicEntry);
        entry['name'] = latestPublicEntry.product
          ? latestPublicEntry.product.name
          : '';
        entry['created_at'] = formatedDate(latestPublicEntry.created_at, 7);
        entry['user'] = latestPublicEntry.user
          ? latestPublicEntry.user.full_name
          : '';
      }

      //CommunityQuestionCategory
      const communityQuestionCond = {
        display_flag: 1,
        is_active: true,
        is_deleted: false,
      };
      let questions = [];
      if (community_search_text) {
        questions = await this.communityQuestionRepository
          .createQueryBuilder('questions')
          .where('questions.question like :question', {
            question: `%${community_search_text}%`,
          })
          .andWhere(communityQuestionCond)
          .select(['questions.id', 'questions.question', 'questions.answer'])
          .leftJoin('questions.category', 'category')
          .addSelect(['category.name'])
          .orderBy('questions.created_at', 'ASC')
          .getMany();
      } else {
        questions = await this.communityQuestionRepository
          .createQueryBuilder('questions')
          .where(communityQuestionCond)
          .select(['questions.id', 'questions.question', 'questions.answer'])
          .leftJoin('questions.category', 'category')
          .addSelect(['category.name'])
          .orderBy('questions.created_at', 'ASC')
          .getMany();
      }

      if (questions.length == 0) {
        return res.send({
          success: true,
          data: { videos, questions: null, entry },
        });
      }
      let groupQuestions = [];
      if (questions.length > 0) {
        //get favourite questions
        const favQuesions = await this.favouriteQuestionRepository.find({
          where: {
            user_id: userId,
            is_favourite: 1,
          },
        });
        //console.log(favQuesions)
        let favQuestionIds = [];

        for (const question of favQuesions) {
          const favQuestionId = question.question_id;
          favQuestionIds.push(favQuestionId);
        }

        //get disliked questions
        const dislikedQuesions = await this.favouriteQuestionRepository.find({
          where: {
            user_id: userId,
            is_favourite: 2,
          },
        });
        // console.log({dislikedQuesions})
        let dislikedQuestionIds = [];

        for (const question of dislikedQuesions) {
          const dislikedQuesion = question.question_id;
          dislikedQuestionIds.push(dislikedQuesion);
        }

        let communityQuestions = [];
        for (const question of questions) {
          let isFavouriteFlag = 0;
          if (favQuestionIds.length > 0) {
            const isFavourite = favQuestionIds.some(function (favQuestion) {
              return favQuestion === question.id;
            });
            if (isFavourite) {
              isFavouriteFlag = 1;
            }
          }
          if (dislikedQuestionIds.length > 0) {
            const isFavourite = dislikedQuestionIds.some(function (
              dislikedQuestionId,
            ) {
              return dislikedQuestionId === question.id;
            });
            if (isFavourite) {
              isFavouriteFlag = 2;
            }
          }
          communityQuestions.push({
            _id: question.id,
            question: question.question,
            answer: question.answer,
            category: question.category,
            is_favourite: isFavouriteFlag,
          });
        }
        //console.log(communityQuestions)
        groupQuestions = communityQuestions.reduce((r, a) => {
          let questionObj = {
            _id: a._id,
            category: a.category.name,
            question: a.question,
            answer: a.answer,
            is_favourite: a.is_favourite,
          };
          r[a.category.name] = [...(r[a.category.name] || []), questionObj];
          return r;
        }, {});
      }

      res.send({
        success: true,
        data: { videos, questions: groupQuestions }, //entry
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async markPublicEntry(req, res, body: any): Promise<any> {
    try {
      const userId = req.user.id;
      const { entry_id, is_public } = body;
      let message = '';
      if (!entry_id) {
        return res.send({ success: false, message: 'Please provide entry id' });
      }
      if (!is_public) {
        return res.send({
          success: false,
          message: 'Please provide public flag',
        });
      }
      const entryInfo = await this.diaryRepository.findOne({
        where: { id: req.body.entry_id, user: userId },
      });
      if (!entryInfo) {
        return res.send({ success: false, message: 'Entry does not exist' });
      }
      if (entryInfo.is_public == is_public) {
        if (is_public == 1) {
          return res.send({
            success: false,
            message: 'Entry has already marked as public',
          });
        }
        if (is_public == 2) {
          return res.send({
            success: false,
            message: 'Entry is already not a public entry',
          });
        }
      }
      entryInfo.is_public = is_public;
      await this.diaryRepository.save(entryInfo);
      if (is_public == 1) {
        message = 'This entry marked as public';
      }
      if (is_public == 2) {
        message = 'This entry marked as private';
      }
      res.send({ success: true, message });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async markFavouriteEntry(req, res, body: any): Promise<any> {
    try {
      const userId = req.user.id;
      const { entry_id, is_favourite } = body;
      if (!entry_id) {
        return res.send({ success: false, message: 'Please provide entry id' });
      }
      if (!is_favourite) {
        return res.send({
          success: false,
          message: 'Please provide favourite falg',
        });
      }
      let success = false;
      let message = '';
      const entryInfo = await this.diaryRepository.findOne({
        where: { id: entry_id, user: userId },
      });
      if (!entryInfo) {
        return res.send({ success: false, message: 'Entry does not exist' });
      }
      if (entryInfo) {
        if (entryInfo.is_favourite == is_favourite) {
          if (is_favourite == 1) {
            message = 'You already have like this entry';
          } else {
            message = 'You already have disliked this entry';
          }
        } else {
          entryInfo.is_favourite = is_favourite;
          await this.diaryRepository.save(entryInfo);
          success = true;
          if (is_favourite == 1) {
            message = 'You like this entry';
          } else {
            message = 'You dislike this entry';
          }
        }
      }
      res.send({ success, message });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async reviewEntry(req, res, body: any): Promise<any> {
    try {
      const userId = req.user.id;
      const { entry_id, ratings } = body;
      if (!entry_id) {
        return res.send({ success: false, message: 'Please provide entry id' });
      }
      if (!ratings) {
        return res.send({ success: false, message: 'Please provide ratings' });
      }
      if (ratings == null) {
        return res.send({ success: false, message: 'Ratings can not be null' });
      }
      const entryInfo = await this.diaryRepository.findOne({
        where: { id: entry_id, is_deleted: false },
      });
      if (!entryInfo) {
        return res.send({ success: false, message: 'Entry does not exist' });
      }
      if (userId != entryInfo.user_id) {
        return res.send({
          success: false,
          message: 'This entry does not belongs to you',
        });
      }
      entryInfo.average_ratings = ratings;
      await this.diaryRepository.save(entryInfo);
      res.send({
        success: true,
        message: 'You have rate this entry successfully',
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getProfileView(req, res): Promise<any> {
    try {
      const { id: userId } = req.user;
      // let user = await this.userRepository
      let profileInfo = await this.userRepository
        .createQueryBuilder('profileInfo')
        .where('profileInfo.id = :userId', { userId })
        .leftJoin('profileInfo.state', 'state')
        .addSelect(['state.name'])
        .leftJoin('state.country', 'country')
        .addSelect(['country.name'])
        .leftJoin('profileInfo.cannabis_consumption', 'cannabis_consumption')
        .addSelect(['cannabis_consumption.name'])
        .leftJoin('profileInfo.physique', 'physique')
        .addSelect(['physique.name'])
        .leftJoin('profileInfo.favourite_strains', 'favourite_strains')
        .addSelect(['favourite_strains.name'])
        .leftJoin('profileInfo.symptom', 'symptom')
        .addSelect(['symptom.name'])
        .leftJoin('profileInfo.effect', 'effect')
        .addSelect(['effect.name'])
        .leftJoin('profileInfo.symptom', 'symptoms')
        .addSelect(['symptom.name', 'symptom.image'])
        .leftJoin('profileInfo.activities', 'activities')
        .addSelect(['activities.name', 'activities.image'])
        .leftJoin('profileInfo.condition', 'condition')
        .addSelect(['condition.name', 'condition.image'])
        .leftJoin('profileInfo.cannabinoids', 'cannabinoids')
        .addSelect(['cannabinoids.name'])
        .leftJoin('profileInfo.consumption_reason', 'consumption_reason')
        .addSelect(['consumption_reason.name'])
        .getOne();
      // let userDetails = profileInfo.toObject();
      const userDetails = Object.assign(profileInfo);

      userDetails.profile_image = profileInfo.profile_image
        ? 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/profile_image/' +
          profileInfo.profile_image
        : '';
      if (profileInfo.dob) {
        userDetails.dob = formatedDate(profileInfo.dob, 7);
      }
      if (userDetails.state) {
        userDetails.state = profileInfo.state.id;
        userDetails.state_name = profileInfo.state.name;
        userDetails.country = profileInfo.state.country.id;
        userDetails.country_name = profileInfo.state.country.name;
      }
      if (userDetails.cannabis_consumption) {
        userDetails.cannabis_consumption_id =
          profileInfo.cannabis_consumption.id;
        userDetails.cannabis_consumption =
          profileInfo.cannabis_consumption.name;
      }
      if (profileInfo.physique) {
        userDetails.physique_id = profileInfo.physique.id;
        userDetails.physique = profileInfo.physique.name;
      }
      if (profileInfo.favourite_strains) {
        userDetails.favourite_strains_id = profileInfo.favourite_strains.id;
        userDetails.favourite_strains = profileInfo.favourite_strains.name;
      }
      if (profileInfo.consumption_reason) {
        userDetails.consumption_reason_id = profileInfo.consumption_reason.id;
        userDetails.consumption_reason = profileInfo.consumption_reason.name;
      }
      if (userDetails.symptoms) {
        let symptoms = [];
        for (var i = 0; i < userDetails.symptoms.length; i++) {
          symptoms.push({
            symptom_id: userDetails.symptoms[i].symptom_id.id,
            symptom_name: userDetails.symptoms[i].symptom_id.name,
            symptom_image: userDetails.symptoms[i].symptom_id.image
              ? 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/symptom/' +
                userDetails.symptoms[i].symptom_id.image
              : '',
          });
        }
        userDetails.symptoms = symptoms;
      }
      if (userDetails.effects) {
        let effects = [];
        for (var i = 0; i < userDetails.effects.length; i++) {
          effects.push({
            effect_id: userDetails.effects[i].effect_id.id,
            effect_name: userDetails.effects[i].effect_id.name,
            effect_image: userDetails.effects[i].effect_id.image
              ? 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/effect/' +
                userDetails.effects[i].effect_id.image
              : '',
          });
        }
        userDetails.effects = effects;
      }
      if (userDetails.cannabinoids) {
        let cannabinoids = [];
        for (var i = 0; i < userDetails.cannabinoids.length; i++) {
          cannabinoids.push({
            cannabinoid_id: userDetails.cannabinoids[i].cannabinoid_id.id,
            cannabinoid_name: userDetails.cannabinoids[i].cannabinoid_id.name,
            cannabinoid_image: userDetails.cannabinoids[i].cannabinoid_id.image
              ? 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/cannabinoid/' +
                userDetails.cannabinoids[i].cannabinoid_id.image
              : '',
          });
        }
        userDetails.cannabinoids = cannabinoids;
      }
      if (userDetails.activities) {
        let activities = [];
        for (var i = 0; i < userDetails.activities.length; i++) {
          activities.push({
            activity_id: userDetails.activities[i].activity_id.id,
            activity_name: userDetails.activities[i].activity_id.name,
            activity_image: userDetails.activities[i].activity_id.image
              ? 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/activity/' +
                userDetails.activities[i].activity_id.image
              : '',
          });
        }
        userDetails.activities = activities;
      }
      if (userDetails.conditions) {
        let conditions = [];
        for (var i = 0; i < userDetails.conditions.length; i++) {
          conditions.push({
            conditions_id: userDetails.conditions[i].condition_id.id,
            conditions_name: userDetails.conditions[i].condition_id.name,
            conditions_image: userDetails.conditions[i].condition_id.image
              ? 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/condition/' +
                userDetails.conditions[i].condition_id.image
              : '',
          });
        }
        userDetails.conditions = conditions;
      }
      //check incomplete entries
      var has_incomplete_entry = false;
      var entry_id = '';
      let incompleteEntry = await this.diaryRepository.findOne({
        where: {
          has_incompleteness_notified: 2,
          is_complete: 2,
          user_id: userDetails.id,
        },
      });

      if (incompleteEntry) {
        has_incomplete_entry = true;
        entry_id = incompleteEntry.id;
      }
      let totalEntry = await this.diaryRepository.count({
        where: {
          user_id: userId,
          is_active: true,
          is_deleted: false,
        },
      });
      let findUser = await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });
      let isProfileComplete = true;
      if (findUser) {
        if (!findUser.full_name) {
          isProfileComplete = false;
        }
        if (!findUser.state) {
          isProfileComplete = false;
        }
        if (!findUser.cannabis_consumption) {
          isProfileComplete = false;
        }
        if (!findUser.dob) {
          isProfileComplete = false;
        }
      }
      res.send({
        success: true,
        message: 'User profile information',
        data: {
          user: userDetails,
          has_incomplete_entry,
          entry_id,
          total_entries: totalEntry,
          isProfileComplete: isProfileComplete,
        },
      });
    } catch (error) {
      console.log({ error });
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getStaticContent(res, slug: any): Promise<any> {
    try {
      if (!slug) {
        return res.send({ success: false, message: 'Please provide slug' });
      }
      const cmsCond = {
        slug: slug,
        is_deleted: false,
        is_active: true,
        content_type: 2,
      };
      const cmsObj = await this.cmsPageRepository.findOne({
        where: cmsCond,
        order: { created_at: 'ASC' },
      });

      if (!cmsObj) {
        return res.send({ success: false, message: 'Content does not exist' });
      }
      const cmsCondSubField = {
        page_title: 1,
        page_content: 1,
        banner_image: 1,
        slug: 1,
      };
      const cmsCondSub = {
        is_deleted: false,
        is_active: true,
        content_type: 2,
        parent_content: cmsObj.id,
      };

      const cmsObjSub = await this.cmsPageRepository
        .createQueryBuilder('cmsObjSub')
        .where(cmsCondSubField)
        .andWhere(cmsCondSub)
        .orderBy('cmsObjSub.created_at', 'ASC')
        .getMany();

      const imagePath =
        'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/cms/';
      const content = {
        page_title: cmsObj.page_title,
        page_content: cmsObj.page_content,
        page_banner_image: cmsObj.banner_image
          ? imagePath + cmsObj.banner_image
          : '',
        page_sub_content: { cmsObjSub },
      };
      res.send({ success: true, data: { content }, message: '' });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getSettingsInfo(req, res): Promise<any> {
    try {
      const userId = req.user.id;
      let userDetails = await this.userRepository.findOne({
        where: { id: userId, is_deleted: false },
        select: [
          'post_consumption_reminder_is_on',
          'post_consumption_reminder_interval',
          'twoFA_is_on',
          'get_tcd_update',
        ],
      });
      if (!userDetails) {
        return res.send({ success: false, message: 'User does not exist' });
      }

      let info = {};
      info['get_tcd_update'] = userDetails.get_tcd_update;
      info['twoFA_is_on'] = userDetails.twoFA_is_on;
      info['is_on'] = userDetails.post_consumption_reminder_is_on;
      info['reminder_interval'] = convertMinsToHrsMins(
        userDetails.post_consumption_reminder_interval,
      );

      res.send({
        success: true,
        data: { info },
        message: 'Information updated succesfully',
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updateNotificationSettings(req, res, body: any): Promise<any> {
    try {
      const userId = req.user.id;
      const { is_on, reminder_interval, twoFA_is_on, get_tcd_update } = body;

      let userDetails = await this.userRepository.findOne({
        where: { id: userId, is_deleted: false },
      });
      if (!userDetails) {
        return res.send({ success: false, message: 'User does not exist' });
      }
      if (is_on) {
        userDetails.post_consumption_reminder_is_on = is_on;
      }
      if (reminder_interval) {
        userDetails.post_consumption_reminder_interval = reminder_interval;
      }
      if (twoFA_is_on) {
        userDetails.twoFA_is_on = twoFA_is_on;
      }
      if (get_tcd_update) {
        userDetails.get_tcd_update = get_tcd_update;
      }

      await this.userRepository.save(userDetails);
      res.send({ success: true, message: 'Information updated succesfully' });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updateProfile(req, res, file): Promise<any> {
    try {
      const { id: userId } = req.user;

      const {
        email,
        dob,
        gender,
        full_name,
        contact_no,
        cannabis_consumption,
        consumption_reason,
        physique,
        height,
        height_scale,
        weight,
        weight_scale,
        activity_level,
        favourite_strains,
        state,
        country,
        zipcode,
        symptoms,
        effects,
        activities,
        conditions,
        cannabinoids,
      } = req.body;
      if (email) {
        const user = await this.userRepository
          .createQueryBuilder('user')
          .where('user.id!=:userId', { userId })
          .andWhere('user.email = :email', { email });
        if (user)
          return res.send({ success: false, message: 'Email already exist!' });

        req.user.email = email;
      }
      if (dob) req.user.dob = new Date(dob);
      if (gender) req.user.dob = gender;
      if (full_name) req.user.full_name = full_name;
      if (contact_no) req.user.contact_no = contact_no;
      if (cannabis_consumption)
        req.user.cannabis_consumption = cannabis_consumption;
      if (consumption_reason) req.user.consumption_reason = consumption_reason;
      if (physique) req.user.physique = physique;
      if (height) req.user.height = height;
      if (height_scale) req.user.height_scale = height_scale;
      if (weight) req.user.weight = weight;
      if (weight_scale) req.user.weight_scale = weight_scale;
      if (activity_level) req.user.activity_level = activity_level;
      if (favourite_strains) req.user.favourite_strains = favourite_strains;
      if (state) req.user.state = state;
      if (country) req.user.country = country;
      if (zipcode) req.user.zipcode = zipcode;
      if (zipcode) req.user.zipcode = zipcode;
      if (symptoms) {
        let symptomInputs = JSON.parse(symptoms);
        let symptomArr = [];
        if (symptomInputs.length > 0) {
          for (let s = 0; s < symptomInputs.length; s++) {
            symptomArr.push({ symptom_id: symptomInputs[s].symptom_id });
          }
        }
        req.user.symptoms = symptomArr;
      }
      if (effects) {
        let effectInputs = JSON.parse(effects);
        let effectArr = [];
        if (effectInputs.length > 0) {
          for (let e = 0; e < effectInputs.length; e++) {
            effectArr.push({ effect_id: effectInputs[e].effect_id });
          }
        }
        req.user.effects = effectArr;
      }
      if (activities) {
        let activityInputs = JSON.parse(activities);
        let activityArr = [];
        if (activityInputs.length > 0) {
          for (let s = 0; s < activityInputs.length; s++) {
            activityArr.push({ activity_id: activityInputs[s].activity_id });
          }
        }
        req.user.activities = activityArr;
      }
      if (conditions) {
        let conditionInputs = JSON.parse(conditions);
        let conditionArr = [];
        if (conditionInputs.length > 0) {
          for (let s = 0; s < conditionInputs.length; s++) {
            conditionArr.push({
              condition_id: conditionInputs[s].condition_id,
            });
          }
        }
        req.user.conditions = conditionArr;
      }
      if (cannabinoids) {
        let cannabinoInputs = JSON.parse(cannabinoids);
        let cannabinoidArr = [];
        if (cannabinoInputs.length > 0) {
          for (var s = 0; s < cannabinoInputs.length; s++) {
            cannabinoidArr.push({
              cannabinoid_id: cannabinoInputs[s].cannabinoid_id,
            });
          }
        }
        req.user.cannabinoids = cannabinoidArr;
      }
      if (file) {
        // if (req.user.profile_image) {
        //   const removeImage = {
        //     imgName: req.user.profile_image,
        //     type: 'profile_image',
        //   };
        //   await this.awsService.s3Remove(removeImage);
        // }

        const profileImage = {
          file: file,
          type: 'profile_image',
        };
        const response = await this.awsService.s3Upload(profileImage);
        console.log({ response });
        if (response) req.user.profile_image = file.filename;
      }
      await req.user.save();
      let profileInfo = await this.userRepository
        .createQueryBuilder('profileInfo')
        .where('profileInfo.id = :userId', { userId })
        .leftJoin('profileInfo.state', 'state')
        .addSelect(['state.name'])
        .leftJoin('state.country', 'country')
        .addSelect(['country.name'])
        .leftJoin('profileInfo.cannabis_consumption', 'cannabis_consumption')
        .addSelect(['cannabis_consumption.name'])
        .leftJoin('profileInfo.physique', 'physique')
        .addSelect(['physique.name'])
        .leftJoin('profileInfo.favourite_strains', 'favourite_strains')
        .addSelect(['favourite_strains.name'])
        .leftJoin('profileInfo.effect', 'effect')
        .addSelect(['effect.name'])
        .leftJoin('profileInfo.symptom', 'symptom')
        .addSelect(['symptom.name'])
        .leftJoin('profileInfo.symptom', 'symptoms')
        .addSelect(['symptom.name', 'symptom.image'])
        .leftJoin('profileInfo.activities', 'activities')
        .addSelect(['activities.name', 'activities.image'])
        .leftJoin('profileInfo.cannabinoids', 'cannabinoids')
        .addSelect(['cannabinoids.name'])
        .leftJoin('profileInfo.consumption_reason', 'consumption_reason')
        .addSelect(['consumption_reason.name'])
        .getOne();
      const userDetails = Object.assign(profileInfo);
      userDetails.profile_image = profileInfo.profile_image
        ? 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/profile_image/' +
          profileInfo.profile_image
        : '';
      if (profileInfo.dob) {
        userDetails.dob = formatedDate(profileInfo.dob, 7);
      }
      if (userDetails.state) {
        userDetails.state = profileInfo.state.id;
        userDetails.state_name = profileInfo.state.name;
        userDetails.country = profileInfo.state.country.id;
        userDetails.country_name = profileInfo.state.country.name;
      }
      if (userDetails.cannabis_consumption) {
        userDetails.cannabis_consumption_id =
          profileInfo.cannabis_consumption.id;
        userDetails.cannabis_consumption =
          profileInfo.cannabis_consumption.name;
      }
      if (profileInfo.physique) {
        userDetails.physique_id = profileInfo.physique.id;
        userDetails.physique = profileInfo.physique.name;
      }
      if (profileInfo.favourite_strains) {
        userDetails.favourite_strains_id = profileInfo.favourite_strains.id;
        userDetails.favourite_strains = profileInfo.favourite_strains.name;
      }
      if (profileInfo.consumption_reason) {
        userDetails.consumption_reason_id = profileInfo.consumption_reason.id;
        userDetails.consumption_reason = profileInfo.consumption_reason.name;
      }

      if (userDetails.symptoms) {
        let symptoms = [];
        for (var i = 0; i < userDetails.symptoms.length; i++) {
          symptoms.push({
            symptom_id: userDetails.symptoms[i].symptom_id.id,
            symptom_name: userDetails.symptoms[i].symptom_id.name,
            symptom_image: userDetails.symptoms[i].symptom_id.image
              ? 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/symptom/' +
                userDetails.symptoms[i].symptom_id.image
              : '',
          });
        }
        userDetails.symptoms = symptoms;
      }

      if (userDetails.effects) {
        let effects = [];
        for (var i = 0; i < userDetails.effects.length; i++) {
          effects.push({
            effect_id: userDetails.effects[i].effect_id.id,
            effect_name: userDetails.effects[i].effect_id.name,
            effect_image: userDetails.effects[i].effect_id.image
              ? 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/effect/' +
                userDetails.effects[i].effect_id.image
              : '',
          });
        }
        userDetails.effects = effects;
      }

      if (userDetails.cannabinoids) {
        let cannabinoids = [];
        for (var i = 0; i < userDetails.cannabinoids.length; i++) {
          cannabinoids.push({
            cannabinoid_id: userDetails.cannabinoids[i].cannabinoid_id.id,
            cannabinoid_name: userDetails.cannabinoids[i].cannabinoid_id.name,
            cannabinoid_image: userDetails.cannabinoids[i].cannabinoid_id.image
              ? 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/cannabinoid/' +
                userDetails.cannabinoids[i].cannabinoid_id.image
              : '',
          });
        }
        userDetails.cannabinoids = cannabinoids;
      }

      if (userDetails.activities) {
        let activities = [];
        for (var i = 0; i < userDetails.activities.length; i++) {
          activities.push({
            activity_id: userDetails.activities[i].activity_id._id,
            activity_name: userDetails.activities[i].activity_id.name,
          });
        }
        userDetails.activities = activities;
      }
      res.send({
        success: true,
        message: 'User profile information updated successfully',
        data: { user: userDetails },
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async saveCompleteEntry(req, res): Promise<any> {
    try {
      const userId = req.user.id;
      const {
        entry_id,
        product_id,
        coa_id,
        comments,
        is_public,
        mood_before_consumption,
        consumption_negative,
        consumption_partner,
        consumption_place,
        consumption_time,
        eat_before_consumption,
        consume_cannabis_before,
        consume_time,
        consumption_method,
        consumption_unit,
        consumption_scale,
        desired_effects,
        desired_activities,
        desired_symptoms,
        desired_condition,
        actual_effects,
        actual_activities,
        actual_symptoms,
        actual_condition,
        midpoint_effects,
        midpoint_activities,
        midpoint_symptoms,
        midpoint_condition,
        symptoms,
        activities,
        condition,
        is_favourite,
        enjoy_taste,
        ratings,
      } = req.body;

      if (!entry_id)
        return res.send({ success: false, message: 'Please provide entry id' });
      const entryId = entry_id;

      let entryInfo = await this.diaryRepository.findOne({
        where: {
          id: entryId,
          user_id: userId,
          is_deleted: false,
        },
      });

      if (!entryInfo)
        return res.send({ success: false, message: 'Entry does not exist' });

      if (product_id) entryInfo.product_id = product_id;
      if (coa_id) entryInfo.coa_id = coa_id;
      if (comments) entryInfo.comments = comments;
      if (is_public) entryInfo.is_public = is_public;
      if (mood_before_consumption)
        entryInfo.mood_before_consumption_id = mood_before_consumption;
      if (consumption_negative) {
        if (consumption_negative.length > 0) {
          let negatives = [];
          for (let s = 0; s < consumption_negative.length; s++) {
            negatives.push({
              negative_id: consumption_negative[s].negative_id,
              diary_id: entryId,
            });
          }
          // entryInfo.consumption_negative = negatives;
          await this.userNegativeConsumptionRepository.save(negatives);
        }
        // else {
        //   let existingConsumptionNegetives = [];
        //   if (entryInfo.consumption_negative.length > 0) {
        //     for (let i = 0; i < entryInfo.consumption_negative.length; i++) {
        //       existingConsumptionNegetives.push(
        //         entryInfo.consumption_negative[i].negative_id
        //       );
        //     }
        //   }
        // Diary.update(
        //   { _id: entryId },
        //   {
        //     $pull: {
        //       consumption_negative: { negative_id: existingConsumptionNegetives },
        //     },
        //   },
        //   { safe: true, multi: true },
        //   function (err, obj) {
        //     //do something smart
        //   }
        // );
        // }
        // entryInfo.consumption_negative = req.body.consumption_negative
      }

      if (consumption_partner)
        entryInfo.consumption_partner = consumption_partner;
      if (consumption_place) entryInfo.consumption_place = consumption_place;
      if (consumption_time) entryInfo.consumption_time = consumption_time;
      if (eat_before_consumption)
        entryInfo.eat_before_consumption = eat_before_consumption;
      if (consume_cannabis_before)
        entryInfo.consume_cannabis_before = consume_cannabis_before;
      if (consume_time) entryInfo.consume_time = consume_time;
      if (consumption_method) entryInfo.consumption_method = consumption_method;
      if (consumption_unit) {
        entryInfo.consumption_unit = consumption_unit;
      }
      if (consumption_scale) {
        entryInfo.consumption_scale = consumption_scale;
      }
      if (desired_effects) {
        // let effectInputs = desired_effects;
        if (desired_effects.length > 0) {
          let desiredEffects = [];
          for (let s = 0; s < desired_effects.length; s++) {
            desiredEffects.push({
              effect_id: desired_effects[s].effect_id,
              diary_id: entryId,
            });
          }
          await this.desiredEffectsRepository.save(desiredEffects);
        }
        //   else {
        //     let existingDesiredEffects = [];
        //     if (entryInfo.desired_effects.length > 0) {
        //       for (let i = 0; i < entryInfo.desired_effects.length; i++) {
        //         existingDesiredEffects.push(
        //           entryInfo.desired_effects[i].effect_id,
        //         );
        //       }
        //     }
        //     // await this.diaryRepository.update({ _id: entryId }, { "$pull": { "desired_effects": { "effect_id": existingDesiredEffects } } }, { safe: true, multi: true });
        //   }
      }
      if (desired_activities) {
        // let desiredActivitiesInputs = desired_activities;
        if (desired_activities.length > 0) {
          let desiredActivities = [];
          for (let s = 0; s < desired_activities.length; s++) {
            desiredActivities.push({
              activity_id: desired_activities[s].activity_id,
              diary_id: entryId,
            });
          }

          await this.desiredActivitiesRepository.save(desiredActivities);
          // entryInfo.desired_activities = desiredActivities;
        }
        // else {
        //   let existingDesiredActivities = [];
        //   if (entryInfo.desired_activities.length > 0) {
        //     for (let i = 0; i < entryInfo.desired_activities.length; i++) {
        //       existingDesiredActivities.push(
        //         entryInfo.desired_activities[i].activity_id,
        //       );
        //     }
        //   }
        //   // await this.diaryRepository.update({ _id: entryId }, { "$pull": { "desired_activities": { "activity_id": existingDesiredActivities } } }, { safe: true, multi: true });
        // }
      }
      if (desired_symptoms) {
        // let desiredSymptomsInputs = desired_symptoms;
        if (desired_symptoms.length > 0) {
          let desiredSymptoms = [];
          for (let s = 0; s < desired_symptoms.length; s++) {
            desiredSymptoms.push({
              symptom_id: desired_symptoms[s].symptom_id,
              diary_id: entryId,
            });
          }
          // entryInfo.desired_symptoms = desiredSymptoms;
          await this.desiredSymptomsRepository.save(desiredSymptoms);
        }
        // else {
        //   let existingDesiredSymptoms = [];
        //   if (entryInfo.desired_symptoms.length > 0) {
        //     for (let i = 0; i < entryInfo.desired_symptoms.length; i++) {
        //       existingDesiredSymptoms.push(
        //         entryInfo.desired_symptoms[i].symptom_id,
        //       );
        //     }
        //   }
        //   // await this.diaryRepository.update({ _id: entryId }, { "$pull": { "desired_symptoms": { "symptom_id": existingDesiredSymptoms } } }, { safe: true, multi: true });
        // }
      }
      if (desired_condition) {
        // let desiredConditionInputs = desired_condition;
        if (desired_condition.length > 0) {
          let desiredCondition = [];
          for (let s = 0; s < desired_condition.length; s++) {
            desiredCondition.push({
              symptom_id: desired_condition[s].condition_id,
              diary_id: entryId,
            });
          }

          await this.desiredConditionRepository.save(desiredCondition);
          // entryInfo.desired_condition = desiredCondition;
        }
        // else {
        //   let existingDesiredCondition = [];
        //   if (entryInfo.desired_condition.length > 0) {
        //     for (let i = 0; i < entryInfo.desired_condition.length; i++) {
        //       existingDesiredCondition.push(
        //         entryInfo.desired_condition[i].condition_id,
        //       );
        //     }
        //   }
        //   // await this.diaryRepository.update({ _id: entryId }, { "$pull": { "desired_condition": { "condition_id": existingDesiredCondition } } }, { safe: true, multi: true });
        // }
      }
      if (actual_effects) {
        let effectInputs = actual_effects;
        if (effectInputs.length > 0) {
          let actualEffects = [];
          for (let s = 0; s < effectInputs.length; s++) {
            actualEffects.push({ effect_id: effectInputs[s].effect_id });
          }

          await this.actualEffectsRepository.save(effectInputs);
          // entryInfo.actual_effects = actualEffects;
        }
        // else {
        //   let existingActualEffects = [];
        //   if (entryInfo.actual_effects.length > 0) {
        //     for (let i = 0; i < entryInfo.actual_effects.length; i++) {
        //       existingActualEffects.push(entryInfo.actual_effects[i].effect_id);
        //     }
        //   }
        //   // await this.diaryRepository.update({ _id: entryId }, { "$pull": { "actual_effects": { "effect_id": existingActualEffects } } }, { safe: true, multi: true });
        // }
      }
      if (actual_activities) {
        if (actual_activities.length > 0) {
          let actualActivities = [];
          for (let s = 0; s < actual_activities.length; s++) {
            actualActivities.push({
              activity_id: actual_activities[s].activity_id,
              diary_id: entryId,
            });
          }
          // entryInfo.actual_activities = actualActivities;
          await this.actualActivitiesRepository.save(actualActivities);
        }
        //  else {
        //   let existingActualActivities = [];
        //   if (entryInfo.actual_activities.length > 0) {
        //     for (let i = 0; i < entryInfo.actual_activities.length; i++) {
        //       existingActualActivities.push(
        //         entryInfo.actual_activities[i].activity_id,
        //       );
        //     }
        //   }
        //   // await this.diaryRepository.update({ _id: entryId }, { "$pull": { "actual_activities": { "activity_id": existingActualActivities } } }, { safe: true, multi: true });
        // }
      }
      if (actual_symptoms) {
        // let symptomsInputs = actual_symptoms;
        if (actual_symptoms.length > 0) {
          let actualSymptoms = [];
          for (let s = 0; s < actual_symptoms.length; s++) {
            actualSymptoms.push({
              symptom_id: actual_symptoms[s].symptom_id,
              diary_id: entryId,
            });
          }
          // entryInfo.actual_symptoms = actualSymptoms;
          await this.actualSymptomsRepository.save(actualSymptoms);
        }
        //   else {
        //     let existingActualSymptoms = [];
        //     if (entryInfo.actual_symptoms.length > 0) {
        //       for (let i = 0; i < entryInfo.actual_symptoms.length; i++) {
        //         existingActualSymptoms.push(
        //           entryInfo.actual_symptoms[i].symptom_id,
        //         );
        //       }
        //     }
        //     // await this.diaryRepository.update({ _id: entryId }, { "$pull": { "actual_symptoms": { "symptom_id": existingActualSymptoms } } }, { safe: true, multi: true });
        //   }
      }
      if (actual_condition) {
        if (actual_condition.length > 0) {
          let actualCondition = [];
          for (let s = 0; s < actual_condition.length; s++) {
            actualCondition.push({
              condition_id: actual_condition[s].condition_id,
              diary_id: entryId,
            });
          }
          // entryInfo.actual_condition = actualCondition;
          await this.actualConditionsRepository.save(actualCondition);
        }
        // else {
        //   let existingActualCondition = [];
        //   if (entryInfo.actual_condition.length > 0) {
        //     for (let i = 0; i < entryInfo.actual_condition.length; i++) {
        //       existingActualCondition.push(
        //         entryInfo.actual_condition[i].condition_id,
        //       );
        //     }
        //   }
        //   // await this.diaryRepository.update({ _id: entryId }, { "$pull": { "actual_condition": { "condition_id": existingActualCondition } } }, { safe: true, multi: true );
        // }
      }
      if (midpoint_effects) {
        // let effectMindpointInputs = midpoint_effects;
        if (midpoint_effects.length > 0) {
          let midpointEffects = [];
          for (let s = 0; s < midpoint_effects.length; s++) {
            midpointEffects.push({
              effect_id: midpoint_effects[s].effect_id,
              diary_id: entryId,
            });
          }
          // entryInfo.midpoint_effects = midpointEffects;
          await this.midPointEffectsRepository.save(midpointEffects);
        }
        //  else {
        //   let existingMidpointEffects = [];
        //   if (entryInfo.midpoint_effects.length > 0) {
        //     for (let i = 0; i < entryInfo.midpoint_effects.length; i++) {
        //       existingMidpointEffects.push(
        //         entryInfo.midpoint_effects[i].effect_id,
        //       );
        //     }
        //   }
        //   // await this.diaryRepository.update({ _id: entryId }, { "$pull": { "midpoint_effects": { "effect_id": existingMidpointEffects } } }, { safe: true, multi: true });
        // }
      }
      if (midpoint_activities) {
        // let activitiesInputs = midpoint_activities;
        if (midpoint_activities.length > 0) {
          let midpointActivities = [];
          for (let s = 0; s < midpoint_activities.length; s++) {
            midpointActivities.push({
              activity_id: midpoint_activities[s].activity_id,
              diary_id: entryId,
            });
          }
          // entryInfo.midpoint_activities = midpointActivities;
          await this.midPointActivitiesRepository.save(midpointActivities);
        }
        // else {
        //   let existingMidpointActivities = [];
        //   if (entryInfo.midpoint_activities.length > 0) {
        //     for (let i = 0; i < entryInfo.midpoint_activities.length; i++) {
        //       existingMidpointActivities.push(
        //         entryInfo.midpoint_activities[i].activity_id,
        //       );
        //     }
        //   }
        //   // await this.diaryRepository.update({ _id: entryId }, { "$pull": { "midpoint_activities": { "activity_id": existingMidpointActivities } } }, { safe: true, multi: true });
        // }
      }
      if (midpoint_symptoms) {
        // let symptomsInputs = midpoint_symptoms;
        if (midpoint_symptoms.length > 0) {
          let midpointSymptoms = [];
          for (let s = 0; s < midpoint_symptoms.length; s++) {
            midpointSymptoms.push({
              symptom_id: midpoint_symptoms[s].symptom_id,
              diary_id: entryId,
            });
          }
          // entryInfo.midpoint_symptoms = midpointSymptoms;
          await this.midPointSymptomsRepository.save(midpointSymptoms);
        }
        // else {
        //   let existingMidpointSymptoms = [];
        //   if (entryInfo.midpoint_symptoms.length > 0) {
        //     for (let i = 0; i < entryInfo.midpoint_symptoms.length; i++) {
        //       existingMidpointSymptoms.push(
        //         entryInfo.midpoint_symptoms[i].symptom_id,
        //       );
        //     }
        //   }
        //   // await this.diaryRepository.update({ _id: entryId }, { "$pull": { "midpoint_symptoms": { "symptom_id": existingMidpointSymptoms } } }, { safe: true, multi: true });
        // }
      }
      if (midpoint_condition) {
        // let midpointConditionInputs = midpoint_condition;
        if (midpoint_condition.length > 0) {
          let midpointCondition = [];
          for (let s = 0; s < midpoint_condition.length; s++) {
            midpointCondition.push({
              condition_id: midpoint_condition[s].condition_id,
              diary_id: entryId,
            });
          }
          await this.midPointConditionsRepository.save(midpointCondition);
        }
        // else {
        //   let existingMidpointCondition = [];
        //   if (entryInfo.midpoint_condition.length > 0) {
        //     for (let i = 0; i < entryInfo.midpoint_condition.length; i++) {
        //       existingMidpointCondition.push(
        //         entryInfo.midpoint_condition[i].condition_id,
        //       );
        //     }
        //   }
        //   // await this.diaryRepository.update({ _id: entryId }, { "$pull": { "midpoint_condition": { "condition_id": existingMidpointCondition } } }, { safe: true, multi: true });
        // }
      }
      if (symptoms) {
        // let symptomInputs = symptoms;
        if (symptoms.length > 0) {
          let preSymptoms = [];
          for (let s = 0; s < symptoms.length; s++) {
            preSymptoms.push({
              symptom_id: symptoms[s].symptom_id,
              diary_id: entryId,
            });
          }
          // entryInfo.pre_symptoms = preSymptoms;
          await this.preSymptomsRepository.save(preSymptoms);
        }
        // else {
        //   let existingSymptomIds = [];
        //   if (entryInfo.pre_symptoms.length > 0) {
        //     for (let i = 0; i < entryInfo.pre_symptoms.length; i++) {
        //       existingSymptomIds.push(entryInfo.pre_symptoms[i].symptom_id);
        //     }
        //   }
        //   // await this.diaryRepository.update({ _id: entryId }, { "$pull": { "pre_symptoms": { "symptom_id": existingSymptomIds } } }, { safe: true, multi: true });
        // }
      }
      if (activities) {
        // let activityInputs = activities;
        if (activities.length > 0) {
          let preActivity = [];
          for (let s = 0; s < activities.length; s++) {
            preActivity.push({
              activity_id: activities[s].activity_id,
              diary_id: entryId,
            });
          }
          // entryInfo.pre_activities = preActivity;
          await this.preActivitiesRepository.save(preActivity);
        }
        //  else {
        //   let existingActivityIds = [];
        //   if (entryInfo.pre_activities.length > 0) {
        //     for (let i = 0; i < entryInfo.pre_activities.length; i++) {
        //       existingActivityIds.push(entryInfo.pre_activities[i].activity_id);
        //     }
        //   }
        //   // await this.diaryRepository.update({ _id: entryId }, { "$pull": { "pre_activities": { "activity_id": existingActivityIds } } }, { safe: true, multi: true });
        // }
      }
      if (condition) {
        // let conditionInputs = condition;
        if (condition.length > 0) {
          let preCondition = [];
          for (let s = 0; s < condition.length; s++) {
            preCondition.push({
              condition_id: condition[s].condition_id,
              diary_id: entryId,
            });
          }
          await this.preConditionRepository.save(preCondition);
          // entryInfo.pre_condition = preCondition;
        }
        // else {
        //   let existingConditionIds = [];
        //   if (entryInfo.pre_condition.length > 0) {
        //     for (let i = 0; i < entryInfo.pre_condition.length; i++) {
        //       existingConditionIds.push(
        //         entryInfo.pre_condition[i].condition_id,
        //       );
        //     }
        //   }
        //   // await this.diaryRepository.update({ _id: entryId }, { "$pull": { "pre_condition": { "condition_id": existingConditionIds } } }, { safe: true, multi: true });
        // }
      }
      if (is_favourite) entryInfo.is_favourite = is_favourite;
      if (enjoy_taste) entryInfo.enjoy_taste = enjoy_taste;
      if (ratings && ratings.length) entryInfo.average_ratings = ratings;
      entryInfo.is_complete = 1;
      entryInfo.has_incompleteness_notified = 1;

      await this.diaryRepository.save(entryInfo);

      let updatedEntryInfo = await this.diaryRepository
        .createQueryBuilder('diary')
        .where({ id: entryId })
        .leftJoin('diary.product', 'product')
        .leftJoin('product.strain', 'strain')
        .addSelect(['strain.name'])
        .leftJoinAndSelect('diary.desired_effects', 'desired_effects')
        .leftJoin('desired_effects.effect', 'd_effect')
        .addSelect(['d_effect.name', 'd_effect.icon'])
        .leftJoinAndSelect('diary.desired_activities', 'desired_activities')
        .leftJoin('desired_activities.activity', 'd_activity')
        .addSelect(['d_activity.name', 'd_activity.icon'])
        .leftJoinAndSelect('diary.desired_symptoms', 'desired_symptoms')
        .leftJoin('desired_symptoms.symptom', 'd_symptom')
        .addSelect(['d_symptom.name', 'd_symptom.icon'])
        .leftJoinAndSelect('diary.desired_condition', 'desired_condition')
        .leftJoin('desired_condition.condition', 'd_condition')
        .addSelect(['d_condition.name', 'd_condition.icon'])
        .leftJoinAndSelect('diary.actual_effects', 'actual_effects')
        .leftJoin('actual_effects.effect', 'a_effect')
        .addSelect(['a_effect.name', 'a_effect.icon'])
        .leftJoinAndSelect('diary.actual_activities', 'actual_activities')
        .leftJoin('actual_activities.activity', 'a_activity')
        .addSelect(['a_activity.name', 'a_activity.icon'])
        .leftJoinAndSelect('diary.actual_symptoms', 'actual_symptoms')
        .leftJoin('actual_symptoms.symptom', 'a_symptoms')
        .addSelect(['a_symptoms.name', 'a_symptoms.icon'])
        .leftJoinAndSelect('diary.actual_condition', 'actual_condition')
        .leftJoin('actual_condition.condition', 'a_condition')
        .addSelect(['a_condition.name', 'a_condition.icon'])
        .leftJoinAndSelect('diary.midpoint_effects', 'midpoint_effects')
        .leftJoin('midpoint_effects.effect', 'm_effect')
        .addSelect(['m_effect.name', 'm_effect.icon'])
        .leftJoinAndSelect('diary.midpoint_activities', 'midpoint_activities')
        .leftJoin('midpoint_activities.activity', 'm_activity')
        .addSelect(['m_activity.name', 'm_activity.icon'])
        .leftJoinAndSelect('diary.midpoint_symptoms', 'midpoint_symptoms')
        .leftJoin('midpoint_symptoms.symptom', 'm_symptom')
        .addSelect(['m_symptom.name', 'm_symptom.icon'])
        .leftJoinAndSelect('diary.midpoint_condition', 'midpoint_condition')
        .leftJoin('midpoint_condition.condition', 'm_condition')
        .addSelect(['m_condition.name', 'm_condition.icon'])
        .leftJoinAndSelect('diary.pre_activities', 'pre_activities')
        .leftJoin('pre_activities.activity', 'activity')
        .addSelect(['activity.name', 'activity.icon'])
        .leftJoinAndSelect('diary.pre_condition', 'pre_condition')
        .leftJoin('pre_condition.condition', 'condition')
        .addSelect(['condition.name', 'condition.icon'])
        .leftJoinAndSelect('diary.pre_symptoms', 'pre_symptoms')
        .leftJoin('pre_symptoms.symptom', 'symptom')
        .addSelect(['symptom.name', 'symptom.icon'])
        .leftJoinAndSelect('diary.pre_effects', 'pre_effects')
        .leftJoin('pre_effects.effect', 'effect')
        .addSelect(['effect.name', 'effect.icon'])
        .getOne();

      let keywords = '';
      if (updatedEntryInfo.product) {
        keywords = updatedEntryInfo.product.strain
          ? updatedEntryInfo.product.strain.name
          : '';
      }
      //Desired
      if (updatedEntryInfo.desired_effects.length > 0) {
        for (let i = 0; i < updatedEntryInfo.desired_effects.length; i++) {
          if (updatedEntryInfo.desired_effects[i].effect_id) {
            keywords += updatedEntryInfo.desired_effects[i].effect.name + ', ';
          }
        }
      }
      if (updatedEntryInfo.desired_activities.length > 0) {
        for (let i = 0; i < updatedEntryInfo.desired_activities.length; i++) {
          if (updatedEntryInfo.desired_activities[i].activity_id) {
            keywords +=
              updatedEntryInfo.desired_activities[i].activity.name + ', ';
          }
        }
      }
      if (updatedEntryInfo.desired_symptoms.length > 0) {
        for (let i = 0; i < updatedEntryInfo.desired_symptoms.length; i++) {
          if (updatedEntryInfo.desired_symptoms[i].symptom_id) {
            keywords +=
              updatedEntryInfo.desired_symptoms[i].symptom.name + ', ';
          }
        }
      }
      if (updatedEntryInfo.desired_condition.length > 0) {
        for (let i = 0; i < updatedEntryInfo.desired_condition.length; i++) {
          if (updatedEntryInfo.desired_condition[i].condition_id) {
            keywords +=
              updatedEntryInfo.desired_condition[i].condition.name + ', ';
          }
        }
      }
      //Actual
      if (updatedEntryInfo.actual_effects.length > 0) {
        for (let i = 0; i < updatedEntryInfo.actual_effects.length; i++) {
          if (updatedEntryInfo.actual_effects[i].effect_id) {
            keywords += updatedEntryInfo.actual_effects[i].effect.name + ', ';
          }
        }
      }
      if (updatedEntryInfo.actual_symptoms.length > 0) {
        for (let i = 0; i < updatedEntryInfo.actual_symptoms.length; i++) {
          if (updatedEntryInfo.actual_symptoms[i].symptom_id) {
            keywords += updatedEntryInfo.actual_symptoms[i].symptom.name + ', ';
          }
        }
      }
      if (updatedEntryInfo.actual_activities.length > 0) {
        for (let i = 0; i < updatedEntryInfo.actual_activities.length; i++) {
          if (updatedEntryInfo.actual_activities[i].activity_id) {
            keywords +=
              updatedEntryInfo.actual_activities[i].activity.name + ', ';
          }
        }
      }
      if (updatedEntryInfo.actual_condition.length > 0) {
        for (let i = 0; i < updatedEntryInfo.actual_condition.length; i++) {
          if (updatedEntryInfo.actual_condition[i].condition_id) {
            keywords +=
              updatedEntryInfo.actual_condition[i].condition.name + ', ';
          }
        }
      }
      //Midpoint
      if (updatedEntryInfo.midpoint_effects.length > 0) {
        for (let i = 0; i < updatedEntryInfo.midpoint_effects.length; i++) {
          if (updatedEntryInfo.midpoint_effects[i].effect_id) {
            keywords += updatedEntryInfo.midpoint_effects[i].effect.name + ', ';
          }
        }
      }
      if (updatedEntryInfo.midpoint_symptoms.length > 0) {
        for (let i = 0; i < updatedEntryInfo.midpoint_symptoms.length; i++) {
          if (updatedEntryInfo.midpoint_symptoms[i].symptom_id) {
            keywords +=
              updatedEntryInfo.midpoint_symptoms[i].symptom.name + ', ';
          }
        }
      }
      if (updatedEntryInfo.midpoint_activities.length > 0) {
        for (let i = 0; i < updatedEntryInfo.midpoint_activities.length; i++) {
          if (updatedEntryInfo.midpoint_activities[i].activity_id) {
            keywords +=
              updatedEntryInfo.midpoint_activities[i].activity.name + ', ';
          }
        }
      }
      if (updatedEntryInfo.midpoint_condition.length > 0) {
        for (let i = 0; i < updatedEntryInfo.midpoint_condition.length; i++) {
          if (updatedEntryInfo.midpoint_condition[i].condition_id) {
            keywords +=
              updatedEntryInfo.midpoint_condition[i].condition.name + ', ';
          }
        }
      }
      //Pre
      if (updatedEntryInfo.pre_activities.length > 0) {
        for (let i = 0; i < updatedEntryInfo.pre_activities.length; i++) {
          if (updatedEntryInfo.pre_activities[i].activity_id) {
            keywords += updatedEntryInfo.pre_activities[i].activity.name + ', ';
          }
        }
      }
      if (updatedEntryInfo.pre_condition.length > 0) {
        for (let i = 0; i < updatedEntryInfo.pre_condition.length; i++) {
          if (updatedEntryInfo.pre_condition[i].condition_id) {
            keywords += updatedEntryInfo.pre_condition[i].condition.name + ', ';
          }
        }
      }
      if (updatedEntryInfo.pre_symptoms.length > 0) {
        for (var i = 0; i < updatedEntryInfo.pre_symptoms.length; i++) {
          if (updatedEntryInfo.pre_symptoms[i].symptom_id) {
            keywords += updatedEntryInfo.pre_symptoms[i].symptom.name + ', ';
          }
        }
      }
      if (updatedEntryInfo.pre_effects.length > 0) {
        for (let i = 0; i < updatedEntryInfo.pre_effects.length; i++) {
          if (updatedEntryInfo.pre_effects[i].effect_id) {
            keywords += updatedEntryInfo.pre_effects[i].effect.name + ', ';
          }
        }
      }

      if (keywords) {
        updatedEntryInfo.keywords = keywords;
        await this.diaryRepository.save(updatedEntryInfo);
      }
      res.send({
        success: true,
        message: 'Entry information updated successfully',
        data: updatedEntryInfo,
      });
    } catch (err) {
      console.log({ err });
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getCompositions(res, type: number): Promise<any> {
    try {
      if (!type) {
        return res.send({ success: false, message: 'Please specify type' });
      }
      let compositions = [];
      const compositionList = await this.compositionRepository.find({
        where: { is_active: true, is_deleted: false, type },
      });
      if (compositionList.length > 0) {
        const imagePath =
          'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/composition/';
        for (const composition of compositionList) {
          compositions.push({
            id: composition.id,
            name: composition.name,
            description: composition.description,
            image: composition.image ? imagePath + composition.image : '',
          });
        }
      }

      res.send({ success: true, data: { compositions } });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async createProduct(req, res, body: any): Promise<any> {
    try {
      const userId = req.user.id;
      const {
        name,
        description,
        product_name,
        product_type,
        weight,
        strain,
        COA_identifier,
        chemical_compounds,
      } = body;
      const check = await this.productRepository.findOne({ where: { name } });
      if (check) {
        const product_id = check.id;
        return res.send({
          success: true,
          message: 'A product with same name already exist',
          data: { product_id },
        });
      }
      const newProduct = {
        name,
        product_name,
        product_type,
        weight,
        strain,
        COA_identifier,
        description: description ? description : '',
        updated_by: userId,
        has_identifier: 1,
      };
      const productInfo = await this.productRepository.save(newProduct);
      if (chemical_compounds && chemical_compounds.length > 0) {
        let compounds = [];
        for (const c of chemical_compounds) {
          compounds.push({
            composition_id: c.composition_id,
            composition_value: c.composition_value,
            product_id: productInfo.id,
          });
        }

        await this.chemicalCompountRepository.save(compounds);
      }
      res.send({
        success: true,
        message: '',
        data: { product_id: productInfo.id },
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getIncompleteDiaryEntries(req, res, search_date): Promise<any> {
    try {
      const userId = req.user.id;
      let entryList = [];
      let findCond = {
        user: userId,
        is_deleted: false,
        is_active: true,
        is_complete: 2,
      };
      if (search_date) {
        const start = new Date(search_date);
        start.setHours(0, 0, 0, 0);

        const end = new Date(search_date);
        end.setHours(23, 59, 59, 999);

        entryList = await this.diaryRepository
          .createQueryBuilder('diary')
          .where(findCond)
          .andWhere('diary.created_at >= :start AND diary.created_at <= :end', {
            start: start,
            end: end,
          })
          .leftJoin('diary.product', 'product')
          .addSelect(['product.name'])
          .leftJoin('product.strain', 'strain')
          .addSelect(['strain.name'])
          .orderBy('diary.created_at', 'ASC')
          .getMany();
      } else {
        entryList = await this.diaryRepository
          .createQueryBuilder('diary')
          .where(findCond)
          .leftJoin('diary.product', 'product')
          .addSelect(['product.name'])
          .leftJoin('product.strain', 'strain')
          .addSelect(['strain.name'])
          .orderBy('diary.created_at', 'ASC')
          .getMany();
      }

      let entries = [];
      if (entryList.length > 0) {
        for (const entry of entryList) {
          let isMyEntryFlag = 2;
          if (entry.user === userId) {
            isMyEntryFlag = 1;
          }

          entries.push({
            id: entry.id,
            name: entry.product ? entry.product.name : '',
            strain: entry.product
              ? entry.product.strain
                ? entry.product.strain.name
                : ''
              : '',
            created_at: formatedDate(entry.created_at, 7),
            day: entry.day_of_week,
            is_public: entry.is_public,
            comments: entry.comments,
            average_ratings: entry.average_ratings,
            is_favourite: isMyEntryFlag == 1 ? entry.is_favourite : 0,
            enjoy_taste: isMyEntryFlag == 1 ? entry.enjoy_taste : false,
          });
        }
      }
      res.send({
        success: true,
        message: 'Your incomplete entry list',
        data: { entries },
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async dashboard(req, res): Promise<any> {
    try {
      const userId = req.user.id;
      const entryCond = { user_id: userId, is_active: true, is_deleted: false };
      const latestPublicEntry = await this.diaryRepository
        .createQueryBuilder('diary')
        .where(entryCond)
        .select([
          'diary.created_at',
          'diary.average_ratings',
          'diary.is_public',
          'diary.day_of_week',
          'diary.is_complete',
          'diary.is_favourite',
          'diary.has_incompleteness_notified',
        ])
        .leftJoin('diary.user', 'user')
        .addSelect(['user.full_name'])
        .leftJoin('diary.product', 'product')
        .addSelect(['product.name'])
        .leftJoinAndSelect('diary.user_comments', 'comments')
        .leftJoin('product.strain', 'strain')
        .addSelect(['strain.name'])
        .leftJoin('product.product_type', 'product_type')
        .addSelect(['product_type.name'])
        .orderBy('diary.created_at', 'ASC')
        .getOne();

      let entry = {};
      if (latestPublicEntry) {
        let strainName = '';
        if (latestPublicEntry.product) {
          if (latestPublicEntry.product.strain) {
            strainName = latestPublicEntry.product.strain.name;
          }
        }
        entry['name'] = latestPublicEntry.product
          ? latestPublicEntry.product.name
          : '';
        entry['strain'] = strainName;
        entry['product_type'] = latestPublicEntry.product
          ? latestPublicEntry.product.product_type.name
          : '';
        entry['created_at'] = formatedDate(latestPublicEntry.created_at, 7);
        entry['created_at_hours'] = formatedDate(
          latestPublicEntry.created_at,
          8,
        );
        let entry_date = [];
        const dateObj = new Date(latestPublicEntry.created_at);
        const monthEntry = dateObj.getUTCMonth() + 1; //months from 1-12
        const dayEntry = dateObj.getUTCDate();
        const yearEntry = dateObj.getUTCFullYear();
        entry_date.push({
          day: dayEntry,
          month: monthEntry,
          year: yearEntry,
          hours: formatedDate(latestPublicEntry.created_at, 8),
        });
        entry['entry_date'] = entry_date;
        entry['user'] = latestPublicEntry.user.full_name;
        entry['is_favourite'] = latestPublicEntry.is_favourite;
      }
      const userEntries = await this.diaryRepository
        .createQueryBuilder('diary')
        .where(entryCond)
        .select([
          'diary.created_at',
          'diary.average_ratings',
          'diary.is_public',
          'diary.day_of_week',
          'diary.is_complete',
          'diary.is_favourite',
          'diary.has_incompleteness_notified',
        ])
        .leftJoin('diary.user', 'user')
        .addSelect(['user.full_name'])
        .leftJoin('diary.product', 'product')
        .addSelect(['product.name'])
        .leftJoinAndSelect('diary.user_comments', 'comments')
        .leftJoin('product.strain', 'strain')
        .addSelect(['strain.name'])
        .leftJoin('product.product_type', 'product_type')
        .addSelect(['product_type.name'])
        .orderBy('diary.created_at', 'ASC')
        .getMany();

      let userAllEntries = [];
      let allEntry = {};
      for (const entry of userEntries) {
        let strainName = '';
        if (entry.product) {
          if (entry.product.strain) {
            strainName = entry.product.strain.name;
          }
        }
        let productTypeName = '';
        // let productTypeName = new String();
        if (entry.product) {
          if (entry.product.product_type) {
            productTypeName = entry.product.product_type.name;
          }
        }
        allEntry['name'] = entry.product ? entry.product.name : '';
        allEntry['strain'] = strainName;
        allEntry['product_type'] = productTypeName;
        allEntry['created_at'] = formatedDate(entry.created_at, 7);
        const created_hours = formatedDate(entry.created_at, 4);
        allEntry['created_at_hours'] = created_hours;
        let allEntry_date = [];
        const dateObj = new Date(entry.created_at);
        const monthEntry = dateObj.getUTCMonth() + 1; //months from 1-12
        const dayEntry = dateObj.getUTCDate();
        const yearEntry = dateObj.getUTCFullYear();
        allEntry_date.push({
          day: dayEntry,
          month: monthEntry,
          year: yearEntry,
          hours: created_hours,
        });
        allEntry['entry_date'] = allEntry_date;
        allEntry['user'] = entry.user.full_name;
        allEntry['is_favourite'] = entry.is_favourite;
        userAllEntries.push(allEntry);
      }

      const total = userEntries.length;
      const favEntryCond = {
        user_id: userId,
        is_active: true,
        is_deleted: false,
        is_favourite: 1,
      };
      const totalFavEntry = await this.diaryRepository.count({
        where: favEntryCond,
      });

      //Get monthly entries
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const noOfDaysInCurrentMonth = new Date(year, month, 0).getDate();

      const monthlyEntries = await this.diaryRepository
        .createQueryBuilder('diary')
        .select('diary.day_of_month', 'id')
        .addSelect('COUNT(diary.day_of_month)', 'count')
        .groupBy('diary.day_of_month')
        .getRawMany();

      let calenderEntries = [];
      let days = [];
      for (let d = 1; d <= noOfDaysInCurrentMonth; d++) {
        days.push(d);
      }

      if (monthlyEntries.length > 0) {
        let existingDays = [];
        for (let i = 0; i < monthlyEntries.length; i++) {
          existingDays.push(monthlyEntries[i].id);
          calenderEntries.push({
            day: monthlyEntries[i].id,
            count: monthlyEntries[i].count,
          });
        }
        for (let i = 0; i < days.length; i++) {
          if (existingDays.includes(days[i]) === false) {
            calenderEntries.push({
              day: days[i],
              count: 0,
            });
          }
        }
      } else {
        for (let d = 0; d < days.length; d++) {
          calenderEntries.push({
            day: days[d],
            count: 0,
          });
        }
      }
      calenderEntries.sort((a, b) => parseFloat(a.day) - parseFloat(b.day));
      res.send({
        success: true,
        message: '',
        data: {
          latest_entry: entry,
          total_entry: total,
          total_favourite_entry: totalFavEntry,
          calender_entries: calenderEntries,
          userAllEntries,
        },
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updateEntryFlag(req, res): Promise<any> {
    try {
      const { entry_id } = req.body;
      const { id } = req.user;

      if (!entry_id) {
        return res.send({ success: false, message: 'Please provide entry id' });
      }
      let entryInfo = await this.diaryRepository.findOne({
        where: {
          id: entry_id,
          user: id,
        },
      });
      if (!entryInfo)
        return res.send({ success: false, message: 'Entry does not exist' });

      entryInfo.has_incompleteness_notified = 1;

      await this.diaryRepository.save(entryInfo);

      res.send({ success: true, message: 'Updated successfully' });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async createEntry(req, res): Promise<any> {
    try {
      const { id: userId } = req.user;

      const {
        product_id,
        comments,
        coa_id,
        symptoms,
        desired_effects,
        activities,
        condition,
        actual_effects,
        cannabinoids,
        terpenes,
      } = req.body;

      if (!product_id)
        return res.send({
          success: false,
          message: 'Please provide product id',
        });

      const currentDate = new Date();

      let entry = {
        user_id: userId,
        product_id: product_id,
        day_of_week: formatedDate(currentDate, 9),
        comments: comments ? comments : '',
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day_of_month: new Date().getDate(),
        updated_by: userId,
      };

      if (coa_id) entry['coa_id'] = coa_id;

      const createdEntry = await this.diaryRepository.save(entry);

      if (createdEntry) {
        if (symptoms.length) {
          let preSymptoms = [];
          for (const symptom of symptoms) {
            preSymptoms.push({
              diary_id: createdEntry.id,
              symptom_id: symptom.symptom_id,
            });
          }
          await this.preSymptomsRepository.save(preSymptoms);
        }

        if (desired_effects.length) {
          let desiredEffects = [];
          for (const desiredEffect of desired_effects) {
            desiredEffects.push({
              diary_id: createdEntry.id,
              effect_id: desiredEffect.effect_id,
            });
          }
          await this.desiredEffectsRepository.save(desiredEffects);
        }

        if (actual_effects.length) {
          let actualEffects = [];
          for (const actualEffect of actual_effects) {
            actualEffects.push({
              diary_id: createdEntry.id,
              effect_id: actualEffect.effect_id,
            });
          }
          await this.actualEffectsRepository.save(actualEffects);
        }

        if (activities.length) {
          let preActivities = [];
          for (const activity of activities) {
            preActivities.push({
              diary_id: createdEntry.id,
              activity_id: activity.activity_id,
            });
          }
          await this.preActivitiesRepository.save(preActivities);
        }

        if (condition.length) {
          let preCondition = [];
          for (const cond of condition) {
            preCondition.push({
              diary_id: createdEntry.id,
              condition_id: cond.condition_id,
            });
          }
          await this.preConditionRepository.save(preCondition);
        }

        if (cannabinoids.length) {
          let cannabinoidProfile = [];
          for (const cannabinoid of cannabinoids) {
            cannabinoidProfile.push({
              entry_id: createdEntry.id,
              composition_id: cannabinoid.composition_id,
              weight: cannabinoid.weight,
            });
          }
          await this.cannabinoidProfileRepository.save(cannabinoidProfile);
        }

        if (terpenes.length) {
          let terpenesProfile = [];
          for (const terpene of terpenes) {
            terpenesProfile.push({
              entry_id: createdEntry.id,
              composition_id: terpene.composition_id,
              weight: terpene.weight,
            });
          }
          await this.terpenesProfileRepository.save(terpenesProfile);
        }
      }

      const totalEntry = await this.diaryRepository.count({
        where: {
          user_id: userId,
          is_active: true,
          is_deleted: false,
        },
      });

      const findUser = await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });

      let isProfileComplete = true;

      if (findUser) {
        if (!findUser.full_name) {
          isProfileComplete = false;
        }
        if (!findUser.state) {
          isProfileComplete = false;
        }
        if (!findUser.cannabis_consumption) {
          isProfileComplete = false;
        }
        if (!findUser.dob) {
          isProfileComplete = false;
        }
      }
      res.send({
        success: true,
        data: {
          entry_id: createdEntry.id,
          total_entries: totalEntry,
          isProfileComplete: isProfileComplete,
        },
        message: 'Your entry saved successfully',
      });
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getBannerAdvertisements(req, res): Promise<any> {
    try {
      let advertisements = await this.bannerAdvertisementRepository.find({
        where: {
          is_deleted: 0,
          is_active: 1,
        },
      });
      let list = [];
      if (advertisements.length > 0) {
        const imagePath =
          'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/banner_advertisement/';
        for (let a = 0; a < advertisements.length; a++) {
          list.push({
            _id: advertisements[a].id,
            title: advertisements[a].banner_advertisement_title,
            image: advertisements[a].banner_advertisement_image
              ? imagePath + advertisements[a].banner_advertisement_image
              : '',
          });
        }
      }
      res.send({
        success: true,
        message: 'Banner advertisement list',
        data: { advertisements: list },
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async addEntryComment(req, res, body: any): Promise<any> {
    try {
      const userId = req.user.id;
      const { entry_id, comment } = body;

      const entryInfo = await this.diaryRepository.findOneBy({ id: entry_id });

      if (!entryInfo) {
        return res.send({ success: false, message: 'Entry does not exist' });
      }
      const user_comments = {
        comment,
        entry_id,
        commented_by: userId,
      };
      await this.diaryCommentsRepository.save(user_comments);
      res.send({ success: true, message: 'Comment added successfully' });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getMasterData(req, res): Promise<any> {
    try {
      const { country_id } = req.query;

      let activities = [];
      let effects = [];
      let symptoms = [];
      let conditions = [];
      let consumptionMethods = [];
      let nagetives = [];
      let countries = [];
      let states = [];

      const uploadDirPath =
        'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin';

      let physique = [];
      const cannabinoidList = await this.cannabinoidRepository.find({
        where: {
          is_active: true,
          is_deleted: false,
        },
      });

      const moodList = await this.moodsRepository.find({
        where: {
          is_active: 1,
          is_deleted: 0,
        },
      });

      const activityList = await this.activityRepository.find({
        where: {
          is_active: true,
          is_deleted: false,
          type: 2,
        },
        select: ['name', 'image', 'icon'],
        order: {
          ['sort_order']: 1,
        },
      });

      if (activityList.length) {
        for (let i = 0; i < activityList.length; i++) {
          activities.push({
            _id: activityList[i].id,
            name: activityList[i].name,
            image: activityList[i].image
              ? uploadDirPath + '/activity/' + activityList[i].image
              : '',
            icon: activityList[i].icon
              ? uploadDirPath + '/activity/' + activityList[i].icon
              : '',
          });
        }
      }

      const methods = await this.consumtionMethodRepository.find({
        where: {
          is_active: true,
          is_deleted: false,
          type: 2,
        },
      });

      if (methods.length) {
        const imagePath =
          'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/methods/';
        for (let i = 0; i < methods.length; i++) {
          let measurementScale = [];
          if (methods[i].measurement_scales.length > 0) {
            for (let s = 0; s < methods[i].measurement_scales.length; s++) {
              measurementScale.push(methods[i].measurement_scales[s].scale);
            }
          }
          consumptionMethods.push({
            _id: methods[i].id,
            name: methods[i].name,
            icon: methods[i].icon ? imagePath + methods[i].icon : '',
            measurement_unit: methods[i].measurement_unit,
            measurement_scales: measurementScale,
          });
        }
      }

      const conditionList = await this.conditionRepository.find({
        where: {
          is_active: true,
          is_deleted: false,
        },
        order: {
          ['sort_order']: 1,
        },
      });

      if (conditionList.length) {
        for (let i = 0; i < conditionList.length; i++) {
          conditions.push({
            _id: conditionList[i].id,
            name: conditionList[i].name,
            image: conditionList[i].image
              ? uploadDirPath + '/condition/' + conditionList[i].image
              : '',
            icon: conditionList[i].icon
              ? uploadDirPath + '/condition/' + conditionList[i].icon
              : '',
          });
        }
      }

      const symptomList = await this.symptomsRepository.find({
        where: {
          is_active: true,
          is_deleted: false,
          type: 2,
        },
        select: ['name', 'image', 'icon'],
        order: {
          ['name']: 1,
        },
      });

      if (symptomList.length) {
        for (let i = 0; i < symptomList.length; i++) {
          symptoms.push({
            _id: symptomList[i].id,
            name: symptomList[i].name,
            image: symptomList[i].image
              ? uploadDirPath + '/symptom/' + symptomList[i].image
              : '',
            icon: symptomList[i].icon
              ? uploadDirPath + '/symptom/' + symptomList[i].icon
              : '',
          });
        }
      }

      const effectList = await this.effectsRepository.find({
        where: {
          is_active: true,
          is_deleted: false,
          type: 2,
        },
        select: ['name', 'image', 'icon'],
        order: {
          ['name']: 1,
        },
      });

      if (effectList.length) {
        for (let i = 0; i < effectList.length; i++) {
          effects.push({
            _id: effectList[i].id,
            name: effectList[i].name,
            image: effectList[i].image
              ? uploadDirPath + '/effect/' + effectList[i].image
              : '',
            icon: effectList[i].icon
              ? uploadDirPath + '/effect/' + effectList[i].icon
              : '',
          });
        }
      }

      countries = await this.countryRepository.find({
        where: {
          is_active: true,
          is_deleted: false,
        },
        select: ['name'],
        order: { ['name']: 1 },
      });

      let stateFindCond = { is_deleted: 0, is_active: 1 };
      if (country_id) stateFindCond['country'] = country_id;

      states = await this.stateRepository.find({
        where: {
          is_active: true,
          is_deleted: false,
        },
        select: ['name'],
        order: { ['name']: 1 },
      });

      const cNegatives = await this.consumptionNegativeRepository.find({
        where: {
          is_active: true,
          is_deleted: false,
        },
        select: ['name'],
        order: { ['name']: 1 },
      });

      const cannabis_consumption =
        await this.consumptionNegativeRepository.find({
          where: {
            is_active: true,
            is_deleted: false,
          },
          select: ['name'],
          order: { ['name']: 1 },
        });

      const consumption_reason = await this.consumptionReasonRepository.find({
        where: {
          is_active: true,
          is_deleted: false,
        },
        select: ['name'],
        order: { ['name']: 1 },
      });

      const genderList = ['Female', 'Male', 'Others', 'Rather not say'];
      let genders = [];

      for (let index in genderList) {
        genders.push({ name: genderList[index] });
      }

      const consumption_time = [
        { name: 'Morning' },
        { name: 'Afternoon' },
        { name: 'Evening' },
        { name: 'Late Night' },
      ];

      const consumption_place = [
        { name: 'Home' },
        { name: 'Friend' },
        { name: 'Out' },
        { name: 'Social' },
      ];

      const consumption_partner = [
        { name: 'Alone' },
        { name: 'Partner' },
        { name: 'Friend' },
        { name: 'Group' },
      ];

      const strainList = await this.strainRepository.find({
        where: {
          is_active: true,
          is_deleted: false,
        },
        select: ['name'],
        order: { ['name']: 1 },
      });

      const communityQuestionCategories =
        await this.communityQuestionCategoryRepository.find({
          where: {
            is_active: true,
            is_deleted: false,
          },
          select: ['name'],
          order: { ['name']: 1 },
        });

      const improvementArea = [
        { name: 'Cannabis Insignt' },
        { name: 'Community' },
        { name: 'Data Insight' },
        { name: 'Diary' },
        { name: 'Entourage Profile' },
        { name: 'Entry Summary' },
        { name: 'FAQ' },
        { name: 'New Entry' },
        { name: 'Other' },
        { name: 'Profile' },
        { name: 'Recommendations' },
        { name: 'Settings' },
      ];

      const support_topics = [
        { name: 'Cannabis Insignt' },
        { name: 'Community' },
        { name: 'Diary' },
        { name: 'Entourage Profile' },
        { name: 'Entry Summary' },
        { name: 'Legal' },
        { name: 'New Entry' },
        { name: 'Other' },
        { name: 'Profile' },
        { name: 'Recommendations' },
        { name: 'Settings' },
      ];

      const weightScales = [{ name: 'kg' }, { name: 'lb' }];

      const heightScales = [{ name: 'cm' }, { name: 'ft' }];

      const activity_level = [
        { name: 'Not active' },
        { name: 'Slightly Active' },
        { name: 'Somewhat active' },
        { name: 'Quite active' },
        { name: 'Very active' },
      ];

      const myEntourage = await this.settingsMyEntourageRepository.find({
        where: {
          is_active: 1,
          is_deleted: 0,
        },
        select: ['id', 'entourage_name', 'max_selection', 'image'],
        order: { ['entourage_name']: 1 },
      });

      let settingsEntourage = [];
      for (let l = 0; l < myEntourage.length; l++) {
        settingsEntourage.push({
          id: myEntourage[l].id,
          name: myEntourage[l].entourage_name,
          image:
            'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/entourage//' +
            myEntourage[l].image,
          description: myEntourage[l].description,
          max_selection: myEntourage[l].max_selection,
        });
      }

      res.send({
        success: true,
        message: 'List of master data',
        data: {
          symptoms,
          physique,
          activities,
          effect_list: effects,
          conditions,
          cannabinoid_list: cannabinoidList,
          mood_list: moodList,
          strains: strainList,
          cannabis_consumption,
          consumption_reason,
          genders,
          consumption_methods: consumptionMethods,
          negatives: cNegatives,
          consumption_time,
          consumption_place,
          consumption_partner,
          community_question_categories: communityQuestionCategories,
          area_of_improvement: improvementArea,
          support_topics,
          weight_scales: weightScales,
          height_scales: heightScales,
          activity_level,
          settings: settingsEntourage,
          states,
          countries,
        },
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // public async getHomeUserComment(req, res): Promise<any> {
  //   try {

  //     const entriesComment = await this.diaryRepository
  //       .createQueryBuilder('entriesComment')
  //     // .where()
  //     // .leftJoin('entriesComment.user_comments', 'user_comments')
  //     // .getMany();

  //     console.log({ entriesComment })

  //     res.send({
  //       success: true,
  //       data: entriesComment,
  //     });
  //   } catch (err) {
  //     throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  public async getDiaryEntries(req, res): Promise<any> {
    try {
      const {
        search_text,
        page,
        is_public,
        ratings,
        search_date,
        search_date_from,
        search_date_to,
      } = req.query;

      const userId = req.user.id;
      let totalPages = 0;
      const limit = 20;
      let skip = 0;
      let total = 0;
      const uploadDirPath =
        'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin';
      let findCond = { user_id: userId, is_deleted: false };
      if (search_text) {
        const logEntry = {
          search_terms: search_text,
          type: 'getDiaryEntries',
          search_by: userId,
        };
        await this.searchLogsRepository.save(logEntry);

        const getIdsSearch = await this.diaryRepository
          .createQueryBuilder('diary')
          .where({ user_id: '232aa8ab-d671-4d7c-902c-23fd96c322c6' })
          .leftJoin('diary.pre_activities', 'user_preactivities')
          .leftJoin('user_preactivities.activity', 'activity')
          .orWhere('activity.name', { name: Like(`%${search_text}%`) })
          .leftJoin('diary.pre_symptoms', 'user_presymptoms')
          .leftJoin('user_presymptoms.symptom', 'symptom')
          .orWhere('symptom.name', { name: Like(`%${search_text}%`) })
          .leftJoin('diary.desired_effects', 'user_desiredeffects')
          .leftJoin('user_desiredeffects.effect', 'effect')
          .orWhere('effect.name', { name: Like(`%${search_text}%`) })
          .select(['diary.id'])
          .getMany();

        let idsArray = getIdsSearch.map((id) => {
          return id.id;
        });

        findCond['id'] = In(idsArray);
      }
      if (page && page > 0) {
        const page_no = parseInt(page);
        skip = (page_no - 1) * limit;
      }
      if (is_public) {
        findCond['is_public'] = is_public;
      }
      if (ratings) {
        findCond['average_ratings'] = ratings;
      }
      if (search_date) {
        const start = new Date(search_date);
        start.setHours(0, 0, 0, 0);

        const end = new Date(search_date);
        end.setHours(23, 59, 59, 999);

        findCond['created_at'] = Between(MoreThanOrEqual(start), LessThan(end));
      }

      if (search_date_from && search_date_to) {
        const start = new Date(search_date_from);
        start.setHours(0, 0, 0, 0);

        const end = new Date(search_date_to);
        end.setHours(23, 59, 59, 999);

        findCond['created_at'] = Between(MoreThanOrEqual(start), LessThan(end));
      }

      total = await this.diaryRepository.count({ where: findCond });
      // if (total == 0) {
      //   return res.send({ success: false, message: 'No records available' });
      // }
      totalPages = Math.ceil(total / limit);
      const entryList = await this.diaryRepository
        .createQueryBuilder('diary')
        .where(findCond)
        .leftJoin('diary.product', 'product')
        .addSelect([
          'product.id',
          'product.name',
          'product.weight',
          'product.description',
        ])
        .leftJoin('product.strain', 'strain')
        .addSelect(['strain.name'])
        .leftJoin('diary.coa', 'coa')
        .addSelect(['coa.laboratory_name', 'coa.tested_at'])
        .leftJoinAndSelect('diary.pre_symptoms', 'pre_symptoms')
        .leftJoin('pre_symptoms.symptom', 'symptom')
        .addSelect(['symptom.name', 'symptom.icon', 'symptom.image'])
        .leftJoinAndSelect('diary.desired_effects', 'desired_effects')
        .leftJoin('desired_effects.effect', 'd_effect')
        .addSelect(['d_effect.name', 'd_effect.icon', 'd_effect.image'])
        .leftJoinAndSelect('diary.actual_effects', 'actual_effects')
        .leftJoin('actual_effects.effect', 'effect')
        .addSelect(['effect.name', 'effect.icon', 'effect.image'])
        .leftJoinAndSelect('diary.pre_activities', 'pre_activities')
        .leftJoin('pre_activities.activity', 'activity')
        .addSelect(['activity.name', 'activity.icon', 'activity.image'])
        .leftJoinAndSelect('diary.pre_condition', 'pre_condition')
        .leftJoin('pre_condition.condition', 'condition')
        .addSelect(['condition.name', 'condition.icon', 'condition.image'])
        .limit(limit)
        .skip(skip)
        .orderBy('diary.created_at', 'ASC')
        .getMany();

      let entries = [];
      let entourage = [];
      let symptoms = [];
      let effects = [];
      let activities = [];
      let condition = [];

      if (entryList.length > 0) {
        for (let i = 0; i < entryList.length; i++) {
          if (entryList[i].pre_symptoms.length > 0) {
            for (let ii = 0; ii < entryList[i].pre_symptoms.length; ii++) {
              symptoms.push({
                symptom_id: entryList[i].pre_symptoms[ii].symptom.id,
                symptom_name: entryList[i].pre_symptoms[ii].symptom.name,
                symptom_image: entryList[i].pre_symptoms[ii].symptom.image
                  ? 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/symptom/' +
                    entryList[i].pre_symptoms[ii].symptom.image
                  : 'https://admin.thecannabisdiary.net/images/logo.png',
                symptom_icon: entryList[i].pre_symptoms[ii].symptom.icon
                  ? uploadDirPath +
                    '/symptom/' +
                    entryList[i].pre_symptoms[ii].symptom.icon
                  : 'https://admin.thecannabisdiary.net/images/logo.png',
              });
            }
          }
          if (entryList[i].desired_effects.length > 0) {
            for (var ii = 0; ii < entryList[i].desired_effects.length; ii++) {
              effects.push({
                effects_id: entryList[i].desired_effects[ii].effect.id,
                effects_name: entryList[i].desired_effects[ii].effect.name,
                effects_image: entryList[i].desired_effects[ii].effect.image
                  ? 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/effect/' +
                    entryList[i].desired_effects[ii].effect.image
                  : 'https://admin.thecannabisdiary.net/images/logo.png',
                effects_icon: entryList[i].desired_effects[ii].effect.icon
                  ? uploadDirPath +
                    '/effect/' +
                    entryList[i].desired_effects[ii].effect.icon
                  : 'https://admin.thecannabisdiary.net/images/logo.png',
              });
            }
          }
          if (entryList[i].pre_activities.length > 0) {
            for (var ii = 0; ii < entryList[i].pre_activities.length; ii++) {
              activities.push({
                activity_id: entryList[i].pre_activities[ii].activity.id,
                activity_name: entryList[i].pre_activities[ii].activity.name,
                activity_image: entryList[i].pre_activities[ii].activity.image
                  ? 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/activity/' +
                    entryList[i].pre_activities[ii].activity.image
                  : 'https://admin.thecannabisdiary.net/images/logo.png',
                activity_icon: entryList[i].pre_activities[ii].activity.icon
                  ? uploadDirPath +
                    '/activity/' +
                    entryList[i].pre_activities[ii].activity.icon
                  : 'https://admin.thecannabisdiary.net/images/logo.png',
              });
            }
          }
          if (entryList[i].pre_condition.length > 0) {
            for (var ii = 0; ii < entryList[i].pre_condition.length; ii++) {
              condition.push({
                condition_id: entryList[i].pre_condition[ii].condition.id,
                condition_name: entryList[i].pre_condition[ii].condition.name,
                condition_image: entryList[i].pre_condition[ii].condition.image
                  ? 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/condition/' +
                    entryList[i].pre_condition[ii].condition.image
                  : 'https://admin.thecannabisdiary.net/images/logo.png',
                condition_icon: entryList[i].pre_condition[ii].condition.icon
                  ? uploadDirPath +
                    '/condition/' +
                    entryList[i].pre_condition[ii].condition.icon
                  : 'https://admin.thecannabisdiary.net/images/logo.png',
              });
            }
          }
          entries.push({
            id: entryList[i].id,
            name: entryList[i].product ? entryList[i].product.name : '',
            strain: entryList[i].product
              ? entryList[i].product.strain
                ? entryList[i].product.strain.name
                : ''
              : '',
            created_at: entryList[i].created_at,
            day: entryList[i].day_of_week,
            is_public: entryList[i].is_public,
            comments: entryList[i].comments,
            average_ratings: entryList[i].average_ratings,
            is_favourite: entryList[i].is_favourite,
            enjoy_taste: entryList[i].enjoy_taste,
            laboratory_name: entryList[i].coa
              ? entryList[i].coa.laboratory_name
              : '',
            tested_at: entryList[i].coa_id
              ? formatedDate(entryList[i].coa.tested_at, 7)
              : '',
            weight: entryList[i].product ? entryList[i].product.weight : '',
            is_complete: entryList[i].is_complete,
            has_incompleteness_notified:
              entryList[i].has_incompleteness_notified,
          });
        }
        let mergedCondition = [];
        if (condition.length > 0) {
          mergedCondition = Object.values(
            condition.reduce((result, obj) => {
              let objKey = obj['condition_name'];
              result[objKey] = result[objKey] || {
                condition_id: obj['condition_id'],
                condition_name: obj['condition_name'],
                condition_image: obj['condition_image'],
                condition_icon: obj['condition_icon'],
                count: 0,
              };
              result[objKey].count += 1;
              return result;
            }, {}),
          );
        }

        let mergedSymptoms = [];
        if (symptoms.length > 0) {
          mergedSymptoms = Object.values(
            symptoms.reduce((result, obj) => {
              let objKey = obj['symptom_name'];
              result[objKey] = result[objKey] || {
                symptom_id: obj['symptom_id'],
                symptom_name: obj['symptom_name'],
                symptom_image: obj['symptom_image'],
                symptom_icon: obj['symptom_icon'],
                count: 0,
              };
              result[objKey].count += 1;
              return result;
            }, {}),
          );
        }

        let mergedEffects = [];
        if (effects.length > 0) {
          mergedEffects = Object.values(
            effects.reduce((result, obj) => {
              let objKey = obj['effects_name'];
              result[objKey] = result[objKey] || {
                effects_id: obj['effects_id'],
                effects_name: obj['effects_name'],
                effects_image: obj['effects_image'],
                effects_icon: obj['effects_icon'],
                count: 0,
              };
              result[objKey].count += 1;
              return result;
            }, {}),
          );
        }

        let mergedActivities = [];
        if (activities.length > 0) {
          mergedActivities = Object.values(
            activities.reduce((result, obj) => {
              let objKey = obj['activity_name'];
              result[objKey] = result[objKey] || {
                activity_id: obj['activity_id'],
                activity_name: obj['activity_name'],
                activity_image: obj['activity_image'],
                activity_icon: obj['activity_icon'],
                count: 0,
              };
              result[objKey].count += 1;
              return result;
            }, {}),
          );
        }
        mergedCondition.sort((a, b) =>
          a.condition_name > b.condition_name
            ? 1
            : b.condition_name > a.condition_name
            ? -1
            : 0,
        );
        mergedSymptoms.sort((a, b) =>
          a.symptom_name > b.symptom_name
            ? 1
            : b.symptom_name > a.symptom_name
            ? -1
            : 0,
        );
        mergedEffects.sort((a, b) =>
          a.effects_name > b.effects_name
            ? 1
            : b.effects_name > a.effects_name
            ? -1
            : 0,
        );
        mergedActivities.sort((a, b) =>
          a.activity_name > b.activity_name
            ? 1
            : b.activity_name > a.activity_name
            ? -1
            : 0,
        );

        entourage.push({
          pre_condition: mergedCondition,
          pre_symptoms: mergedSymptoms,
          actual_effects: mergedEffects,
          pre_activities: mergedActivities,
        });
      }
      res.send({
        success: true,
        message: 'Your entry list',
        data: {
          entries,
          entourage,
          total,
          record_per_page: limit,
          total_pages: totalPages,
        },
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getAllEntries(req, res, query_params: any): Promise<any> {
    try {
      const {
        search_text,
        is_public,
        ratings,
        search_date_from,
        search_date_to,
        page,
      } = query_params;
      const userId = req.user.id;
      const limit = 20;
      let skip = 0;
      let total = 0;
      let totalPages = 0;
      let findCond = {
        is_active: true,
        is_deleted: false,
        user_id: userId,
        is_public: 1,
      };
      if (search_text) {
        findCond['keywords'] = Like(`%${search_text}%`);
        const logEntry = {
          search_terms: search_text,
          type: 'getAllEntries',
          search_by: userId,
        };
        await this.searchLogsRepository.save(logEntry);
      }
      if (is_public) {
        findCond.is_public = is_public;
      }
      if (ratings) {
        findCond['average_ratings'] = ratings;
      }
      if (search_date_from && search_date_to) {
        const start = new Date(search_date_from);
        start.setHours(0, 0, 0, 0);

        const end = new Date(search_date_to);
        end.setHours(23, 59, 59, 999);

        findCond['created_at'] = Between(MoreThanOrEqual(start), LessThan(end));
      }
      if (page && page > 0) {
        const page_no = parseInt(page);
        skip = (page_no - 1) * limit;
      }
      total = await this.diaryRepository.count({ where: findCond });
      if (total == 0) {
        return res.send({ success: false, message: 'No records available' });
      }
      totalPages = Math.ceil(total / limit);

      const entryList = await this.diaryRepository
        .createQueryBuilder('diary')
        .where(findCond)
        .leftJoin('diary.user', 'user')
        .addSelect(['user.full_name', 'user.id'])
        .leftJoin('diary.product', 'product')
        .addSelect([
          'product.id',
          'product.name',
          'product.weight',
          'product.description',
        ])
        .leftJoin('product.strain', 'strain')
        .addSelect(['strain.name'])
        .leftJoin('diary.coa', 'coa')
        .addSelect(['coa.laboratory_name', 'coa.tested_at'])
        .limit(limit)
        .skip(skip)
        .orderBy('diary.created_at', 'ASC')
        .getMany();

      let entries = [];
      if (entryList.length > 0) {
        for (var i = 0; i < entryList.length; i++) {
          var isMyEntryFlag = 2;
          if (entryList[i].user.id === userId) {
            isMyEntryFlag = 1;
          }

          entries.push({
            id: entryList[i].id,
            user: entryList[i].user.full_name,
            name: entryList[i].product ? entryList[i].product.name : '',
            strain: entryList[i].product
              ? entryList[i].product.strain
                ? entryList[i].product.strain.name
                : ''
              : '',
            description: entryList[i].product
              ? entryList[i].product.description
              : '',
            created_at: formatedDate(entryList[i].created_at, 7),
            day: entryList[i].day_of_week,
            is_public: entryList[i].is_public,
            comments: entryList[i].comments,
            average_ratings: entryList[i].average_ratings,
            is_favourite: isMyEntryFlag == 1 ? entryList[i].is_favourite : 0,
            enjoy_taste: isMyEntryFlag == 1 ? entryList[i].enjoy_taste : false,
            laboratory_name: entryList[i].coa
              ? entryList[i].coa.laboratory_name
              : '',
            tested_at: entryList[i].coa
              ? formatedDate(entryList[i].coa.tested_at, 7)
              : '',
            weight: entryList[i].product ? entryList[i].product.weight : '',
            is_my_entry: isMyEntryFlag,
            is_complete: entryList[i].is_complete,
          });
        }
      }

      res.send({
        success: true,
        message: 'Your entry list',
        data: {
          entries,
          total,
          record_per_page: limit,
          total_pages: totalPages,
        },
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getDiaryEntryDetails(req, res, entry_id: any): Promise<any> {
    try {
      const userId = req.user.id;
      const uploadDirPath =
        'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin';
      const findCond = { id: entry_id, is_deleted: false };

      const entryInfo = await this.diaryRepository
        .createQueryBuilder('diary')
        .where(findCond)
        .leftJoin('diary.user', 'user')
        .addSelect(['user.full_name'])
        .leftJoin('diary.product', 'product')
        .addSelect([
          'product.id',
          'product.name',
          'product.weight',
          'product.description',
          'product.product_image',
        ])
        .leftJoin('product.product_type', 'product_type')
        .addSelect([
          'product_type.name',
          'product_type.type',
          "'product_type.parent_id'",
        ])
        .leftJoin('product.strain', 'strain')
        .addSelect(['strain.name'])
        .leftJoinAndSelect('diary.consumption_negative', 'consumption_negative')
        .leftJoin(
          'consumption_negative.consumption_negative',
          'consumption_negativ',
        )
        .addSelect(['consumption_negativ.name', 'consumption_negativ.id'])
        .leftJoin('diary.coa', 'coa')
        .addSelect(['coa.laboratory_name', 'coa.tested_at'])
        .leftJoinAndSelect('diary.pre_symptoms', 'pre_symptoms')
        .leftJoin('pre_symptoms.symptom', 'symptom')
        .addSelect(['symptom.name', 'symptom.icon'])
        .leftJoinAndSelect('diary.desired_effects', 'desired_effects')
        .leftJoin('desired_effects.effect', 'd_effect')
        .addSelect(['d_effect.name', 'd_effect.icon'])
        .leftJoinAndSelect('diary.desired_activities', 'desired_activities')
        .leftJoin('desired_activities.activity', 'd_activity')
        .addSelect(['d_activity.name', 'd_activity.icon'])
        .leftJoinAndSelect('diary.desired_symptoms', 'desired_symptoms')
        .leftJoin('desired_symptoms.symptom', 'd_symptom')
        .addSelect(['d_symptom.name', 'd_symptom.icon'])
        .leftJoinAndSelect('diary.desired_condition', 'desired_condition')
        .leftJoin('desired_condition.condition', 'd_condition')
        .addSelect(['d_condition.name', 'd_condition.icon'])
        .leftJoinAndSelect('diary.actual_effects', 'actual_effects')
        .leftJoin('actual_effects.effect', 'a_effect')
        .addSelect(['a_effect.name', 'a_effect.icon'])
        .leftJoinAndSelect('diary.actual_symptoms', 'actual_symptoms')
        .leftJoin('actual_symptoms.symptom', 'a_symptoms')
        .addSelect(['a_symptoms.name', 'a_symptoms.icon'])
        .leftJoinAndSelect('diary.actual_activities', 'actual_activities')
        .leftJoin('actual_activities.activity', 'a_activity')
        .addSelect(['a_activity.name', 'a_activity.icon'])
        .leftJoinAndSelect('diary.actual_condition', 'actual_condition')
        .leftJoin('actual_condition.condition', 'a_condition')
        .addSelect(['a_condition.name', 'a_condition.icon'])
        .leftJoinAndSelect('diary.midpoint_effects', 'midpoint_effects')
        .leftJoin('midpoint_effects.effect', 'm_effect')
        .addSelect(['m_effect.name', 'm_effect.icon'])
        .leftJoinAndSelect('diary.midpoint_symptoms', 'midpoint_symptoms')
        .leftJoin('midpoint_symptoms.symptom', 'm_symptom')
        .addSelect(['m_symptom.name', 'm_symptom.icon'])
        .leftJoinAndSelect('diary.midpoint_activities', 'midpoint_activities')
        .leftJoin('midpoint_activities.activity', 'm_activity')
        .addSelect(['m_activity.name', 'm_activity.icon'])
        .leftJoinAndSelect('diary.midpoint_condition', 'midpoint_condition')
        .leftJoin('midpoint_condition.condition', 'm_condition')
        .addSelect(['m_condition.name', 'm_condition.icon'])
        .leftJoinAndSelect('diary.pre_activities', 'pre_activities')
        .leftJoin('pre_activities.activity', 'activity')
        .addSelect(['activity.name', 'activity.icon'])
        .leftJoinAndSelect('diary.pre_condition', 'pre_condition')
        .leftJoin('pre_condition.condition', 'condition')
        .addSelect(['condition.name', 'condition.icon'])
        .leftJoinAndSelect('diary.pre_effects', 'pre_effects')
        .leftJoin('pre_effects.effect', 'effect')
        .addSelect(['effect.name', 'effect.icon'])
        .leftJoinAndSelect('diary.cannabinoid_profile', 'cannabinoid_profile')
        .leftJoin('cannabinoid_profile.composition', 'composition')
        .addSelect(['composition.name', 'composition.description'])
        .leftJoinAndSelect('diary.user_comments', 'user_comments')
        .leftJoin('user_comments.user', 'users')
        .addSelect(['users.full_name'])
        .leftJoinAndSelect('diary.terpenes', 'terpenes')
        .leftJoin('terpenes.composition', 't_composition')
        .addSelect(['t_composition.name', 't_composition.description'])
        .leftJoinAndSelect('diary.consumption_method', 'consumption_method')
        .addSelect(['consumption_method.name'])
        .leftJoinAndSelect(
          'diary.mood_before_consumption',
          'mood_before_consumption',
        )
        .addSelect(['mood_before_consumption.name'])
        .getOne();

      console.log({ entryInfo });

      if (!entryInfo) {
        return res.send({ success: false, message: 'Entry does not exist' });
      }
      const prdImagePath =
        'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/product/';
      let product_image = '';
      if (entryInfo.product) {
        product_image = entryInfo.product.product_image
          ? prdImagePath + entryInfo.product.product_image
          : '';
      }
      let consumptionNegetives = [];
      if (
        entryInfo.consumption_negative &&
        entryInfo.consumption_negative.length > 0
      ) {
        for (let e = 0; e < entryInfo.consumption_negative.length; e++) {
          consumptionNegetives.push({
            negative_id:
              entryInfo.consumption_negative[e].consumption_negative.id,
            negative_name:
              entryInfo.consumption_negative[e].consumption_negative.name,
          });
        }
      }
      // //Desired

      let desiredActivities = [];
      if (entryInfo.desired_activities.length > 0) {
        for (let e = 0; e < entryInfo.desired_activities.length; e++) {
          if (entryInfo.desired_activities[e].activity) {
            desiredActivities.push({
              activity_id: entryInfo.desired_activities[e].activity.id,
              activity_name: entryInfo.desired_activities[e].activity.name,
              activity_icon: entryInfo.desired_activities[e].activity.icon
                ? uploadDirPath +
                  '/activity/' +
                  entryInfo.desired_activities[e].activity.icon
                : '',
            });
          }
        }
      }

      let desiredSymptoms = [];
      if (entryInfo.desired_symptoms.length > 0) {
        for (let s = 0; s < entryInfo.desired_symptoms.length; s++) {
          desiredSymptoms.push({
            symptom_id: entryInfo.desired_symptoms[s].symptom.id,
            symptom_name: entryInfo.desired_symptoms[s].symptom.name,
            symptom_icon: entryInfo.desired_symptoms[s].symptom.icon
              ? uploadDirPath +
                '/symptom/' +
                entryInfo.desired_symptoms[s].symptom.icon
              : '',
          });
        }
      }
      let desiredEffects = [];
      if (entryInfo.desired_effects.length > 0) {
        for (let e = 0; e < entryInfo.desired_effects.length; e++) {
          if (entryInfo.desired_effects[e].effect) {
            desiredEffects.push({
              effect_id: entryInfo.desired_effects[e].effect.id,
              effect_name: entryInfo.desired_effects[e].effect.name,
              effect_icon: entryInfo.desired_effects[e].effect.icon
                ? uploadDirPath +
                  '/effect/' +
                  entryInfo.desired_effects[e].effect.icon
                : '',
            });
          }
        }
      }
      let desiredCondition = [];
      if (entryInfo.desired_condition.length > 0) {
        for (let e = 0; e < entryInfo.desired_condition.length; e++) {
          if (entryInfo.desired_condition[e].condition) {
            desiredCondition.push({
              condition_id: entryInfo.desired_condition[e].condition.id,
              condition_name: entryInfo.desired_condition[e].condition.name,
              condition_icon: entryInfo.desired_condition[e].condition.icon
                ? uploadDirPath +
                  '/condition/' +
                  entryInfo.desired_condition[e].condition.icon
                : '',
            });
          }
        }
      }
      let actualEffects = [];
      if (entryInfo.actual_effects.length > 0) {
        for (let e = 0; e < entryInfo.actual_effects.length; e++) {
          if (entryInfo.actual_effects[e].effect) {
            actualEffects.push({
              effect_id: entryInfo.actual_effects[e].effect.id,
              effect_name: entryInfo.actual_effects[e].effect.name,
              effect_icon: entryInfo.actual_effects[e].effect.icon
                ? uploadDirPath +
                  '/effect/' +
                  entryInfo.actual_effects[e].effect.icon
                : '',
            });
          }
        }
      }
      let actualActivities = [];
      if (entryInfo.actual_activities.length > 0) {
        for (let e = 0; e < entryInfo.actual_activities.length; e++) {
          if (entryInfo.actual_activities[e].activity) {
            actualActivities.push({
              activity_id: entryInfo.actual_activities[e].activity.id,
              activity_name: entryInfo.actual_activities[e].activity.name,
              activity_icon: entryInfo.actual_activities[e].activity.icon
                ? uploadDirPath +
                  '/activity/' +
                  entryInfo.actual_activities[e].activity.icon
                : '',
            });
          }
        }
      }
      let actualSymptoms = [];
      if (entryInfo.actual_symptoms.length > 0) {
        for (let s = 0; s < entryInfo.actual_symptoms.length; s++) {
          actualSymptoms.push({
            symptom_id: entryInfo.actual_symptoms[s].symptom.id,
            symptom_name: entryInfo.actual_symptoms[s].symptom.name,
            symptom_icon: entryInfo.actual_symptoms[s].symptom.icon
              ? uploadDirPath +
                '/symptom/' +
                entryInfo.actual_symptoms[s].symptom.icon
              : '',
          });
        }
      }
      let actualCondition = [];
      if (entryInfo.actual_condition.length > 0) {
        for (let e = 0; e < entryInfo.actual_condition.length; e++) {
          if (entryInfo.actual_condition[e].condition) {
            actualCondition.push({
              condition_id: entryInfo.actual_condition[e].condition.id,
              condition_name: entryInfo.actual_condition[e].condition.name,
              condition_icon: entryInfo.actual_condition[e].condition.icon
                ? uploadDirPath +
                  '/condition/' +
                  entryInfo.actual_condition[e].condition.icon
                : '',
            });
          }
        }
      }
      let midpointEffects = [];
      if (entryInfo.midpoint_effects.length > 0) {
        for (let e = 0; e < entryInfo.midpoint_effects.length; e++) {
          if (entryInfo.midpoint_effects[e].effect) {
            midpointEffects.push({
              effect_id: entryInfo.midpoint_effects[e].effect.id,
              effect_name: entryInfo.midpoint_effects[e].effect.name,
              effect_icon: entryInfo.midpoint_effects[e].effect.icon
                ? uploadDirPath +
                  '/effect/' +
                  entryInfo.midpoint_effects[e].effect.icon
                : '',
            });
          }
        }
      }
      let midpointActivities = [];
      if (entryInfo.midpoint_activities.length > 0) {
        for (let e = 0; e < entryInfo.midpoint_activities.length; e++) {
          if (entryInfo.midpoint_activities[e].activity) {
            midpointActivities.push({
              activity_id: entryInfo.midpoint_activities[e].activity.id,
              activity_name: entryInfo.midpoint_activities[e].activity.name,
              activity_icon: entryInfo.midpoint_activities[e].activity.icon
                ? uploadDirPath +
                  '/activity/' +
                  entryInfo.midpoint_activities[e].activity.icon
                : '',
            });
          }
        }
      }
      let midpointSymptoms = [];
      if (entryInfo.midpoint_symptoms.length > 0) {
        for (let s = 0; s < entryInfo.midpoint_symptoms.length; s++) {
          midpointSymptoms.push({
            symptom_id: entryInfo.midpoint_symptoms[s].symptom.id,
            symptom_name: entryInfo.midpoint_symptoms[s].symptom.name,
            symptom_icon: entryInfo.midpoint_symptoms[s].symptom.icon
              ? uploadDirPath +
                '/symptom/' +
                entryInfo.midpoint_symptoms[s].symptom.icon
              : '',
          });
        }
      }
      let midpointCondition = [];
      if (entryInfo.midpoint_condition.length > 0) {
        for (let e = 0; e < entryInfo.midpoint_condition.length; e++) {
          if (entryInfo.midpoint_condition[e].condition) {
            midpointCondition.push({
              condition_id: entryInfo.midpoint_condition[e].condition.id,
              condition_name: entryInfo.midpoint_condition[e].condition.name,
              condition_icon: entryInfo.midpoint_condition[e].condition.icon
                ? uploadDirPath +
                  '/condition/' +
                  entryInfo.midpoint_condition[e].condition.icon
                : '',
            });
          }
        }
      }
      let symptoms = [];
      if (entryInfo.pre_symptoms.length > 0) {
        for (let s = 0; s < entryInfo.pre_symptoms.length; s++) {
          symptoms.push({
            symptom_id: entryInfo.pre_symptoms[s].symptom.id,
            symptom_name: entryInfo.pre_symptoms[s].symptom.name,
            symptom_icon: entryInfo.pre_symptoms[s].symptom.icon
              ? uploadDirPath +
                '/symptom/' +
                entryInfo.pre_symptoms[s].symptom.icon
              : '',
          });
        }
      }
      let activities = [];
      if (entryInfo.pre_activities.length > 0) {
        for (let a = 0; a < entryInfo.pre_activities.length; a++) {
          activities.push({
            activity_id: entryInfo.pre_activities[a].activity.id,
            activity_name: entryInfo.pre_activities[a].activity.name,
            activity_icon: entryInfo.pre_activities[a].activity.icon
              ? uploadDirPath +
                '/activity/' +
                entryInfo.pre_activities[a].activity.icon
              : '',
          });
        }
      }
      let condition = [];
      if (entryInfo.pre_condition.length > 0) {
        for (let a = 0; a < entryInfo.pre_condition.length; a++) {
          condition.push({
            condition_id: entryInfo.pre_condition[a].condition.id,
            condition_name: entryInfo.pre_condition[a].condition.name,
            condition_icon: entryInfo.pre_condition[a].condition.icon
              ? uploadDirPath +
                '/condition/' +
                entryInfo.pre_condition[a].condition.icon
              : '',
          });
        }
      }
      let effects = [];
      if (entryInfo.pre_effects.length > 0) {
        for (var a = 0; a < entryInfo.pre_effects.length; a++) {
          condition.push({
            effect_id: entryInfo.pre_effects[a].effect.id,
            effect_name: entryInfo.pre_effects[a].effect.name,
            effect_icon: entryInfo.pre_effects[a].effect.icon
              ? uploadDirPath +
                '/effect/' +
                entryInfo.pre_effects[a].effect.icon
              : '',
          });
        }
      }
      // //composition information

      let cannabinoid_profile = [];
      if (entryInfo.cannabinoid_profile.length > 0) {
        for (let c = 0; c < entryInfo.cannabinoid_profile.length; c++) {
          if (
            entryInfo.cannabinoid_profile[c].weight &&
            entryInfo.cannabinoid_profile[c].weight > 0
          ) {
            cannabinoid_profile.push({
              composition_id: entryInfo.cannabinoid_profile[c].composition.id,
              composition_name:
                entryInfo.cannabinoid_profile[c].composition.name,
              composition_description: entryInfo.cannabinoid_profile[c]
                .composition.description
                ? entryInfo.cannabinoid_profile[c].composition.description
                : '',
              weight: entryInfo.cannabinoid_profile[c].weight,
            });
          }
        }
        cannabinoid_profile = cannabinoid_profile.sort(dynamicSort('weight'));
      }
      let terpenes = [];
      if (entryInfo.terpenes.length > 0) {
        for (let c = 0; c < entryInfo.terpenes.length; c++) {
          if (
            entryInfo.terpenes[c].weight &&
            entryInfo.terpenes[c].weight > 0
          ) {
            terpenes.push({
              composition_id: entryInfo.terpenes[c].composition.id,
              composition_name: entryInfo.terpenes[c].composition.name,
              composition_description: entryInfo.terpenes[c].composition
                .description
                ? entryInfo.terpenes[c].composition.description
                : '',
              weight: entryInfo.terpenes[c].weight,
            });
          }
        }
        terpenes = terpenes.sort(dynamicSort('weight'));
      }
      // let user_comments = []
      // if(entryInfo.user_comments){
      //     for(var uc=0;uc<entryInfo.user_comments.length;uc++){
      //         user_comments.push({
      //             commented_by:entryInfo.user_comments[uc].commented_by.full_name,
      //             comment:entryInfo.user_comments[uc].comment,
      //             created_at:CommonHelper.formatedDate(entryInfo.user_comments[uc].created_at,7)
      //         })
      //     }
      // }
      let isMyEntryFlag = 2;
      if (entryInfo.user === userId) {
        isMyEntryFlag = 1;
      }
      let is_parent_product_type = 0;
      if (entryInfo.product) {
        is_parent_product_type = entryInfo.product.product_type
          ? entryInfo.product.product_type.type == 1
            ? 1
            : 2
          : 0;
      }
      // console.log('hi')
      // console.log(is_parent_product_type)
      let entryDetails = {
        id: entryInfo.id,
        user_name: entryInfo.user ? entryInfo.user.full_name : '',
        name: entryInfo.product ? entryInfo.product.name : '',
        is_parent: is_parent_product_type,
        parent_product_type:
          is_parent_product_type == 2
            ? entryInfo.product.product_type.parent_id
              ? entryInfo.product.product_type.parent_id.id
              : ''
            : '',
        parent_product_type_name:
          is_parent_product_type == 2
            ? entryInfo.product.product_type.parent_id.name
            : '',
        product_type: entryInfo.product
          ? entryInfo.product.product_type
            ? entryInfo.product.product_type.id
            : ''
          : '',
        product_type_name: entryInfo.product
          ? entryInfo.product.product_type
            ? entryInfo.product.product_type.name
            : ''
          : '',
        product_id: entryInfo.product ? entryInfo.product.id : '',
        strain: entryInfo.product
          ? entryInfo.product.strain
            ? entryInfo.product.strain.name
            : ''
          : '',
        description: entryInfo.product ? entryInfo.product.description : '',
        weight: entryInfo.product ? entryInfo.product.weight : '',
        consumption_method: entryInfo.consumption_method
          ? entryInfo.consumption_method.id
          : '',
        consumption_method_name: entryInfo.consumption_method
          ? entryInfo.consumption_method.name
          : '',
        consumption_scale: entryInfo.consumption_scale
          ? entryInfo.consumption_scale
          : '',
        consumption_unit: entryInfo.consumption_unit
          ? entryInfo.consumption_unit
          : '',
        consumed_amount:
          entryInfo.consumption_scale + ' ' + entryInfo.consumption_unit,
        created_at: formatedDate(entryInfo.created_at, 7),
        day: entryInfo.day_of_week,
        is_public: entryInfo.is_public,
        comments: entryInfo.comments,
        average_ratings: entryInfo.average_ratings,
        pre_symptoms: symptoms,
        desired_effects: desiredEffects,
        desired_activities: desiredActivities,
        desired_symptoms: desiredSymptoms,
        desired_condition: desiredCondition,
        actual_effects: actualEffects,
        actual_activities: actualActivities,
        actual_symptoms: actualSymptoms,
        actual_condition: actualCondition,
        midpoint_effects: midpointEffects,
        midpoint_activities: midpointActivities,
        midpoint_symptoms: midpointSymptoms,
        midpoint_condition: midpointCondition,
        pre_activities: activities,
        pre_condition: condition,
        consumption_negative: consumptionNegetives,
        is_favourite: isMyEntryFlag == 1 ? entryInfo.is_favourite : 0,
        enjoy_taste: isMyEntryFlag == 1 ? entryInfo.enjoy_taste : false,
        cannabinoid_profile,
        terpenes,
        eat_before_consumption: entryInfo.eat_before_consumption,
        consumption_time: entryInfo.consumption_time,
        consumption_place: entryInfo.consumption_place,
        consumption_partner: entryInfo.consumption_partner,
        // consumption_negative:(entryInfo.consumption_negative) ? entryInfo.consumption_negative.id:'',
        // consumption_negative_name:(entryInfo.consumption_negative) ? entryInfo.consumption_negative.name :'',
        mood_before_consumption: entryInfo.mood_before_consumption
          ? entryInfo.mood_before_consumption.id
          : '',
        mood_before_consumption_name: entryInfo.mood_before_consumption
          ? entryInfo.mood_before_consumption.name
          : '',
        consume_cannabis_before: entryInfo.consume_cannabis_before,
        consume_time: entryInfo.consume_time,
        is_complete: entryInfo.is_complete,
        is_my_entry: isMyEntryFlag,
        product_image,
        laboratory_name: '',
        tested_at: '',
      };
      if (entryInfo.coa) {
        entryDetails['coa_id'] = entryInfo.coa.id;
        entryDetails.laboratory_name = entryInfo.coa_id
          ? entryInfo.coa.laboratory_name
          : '';
        entryDetails.tested_at = entryInfo.coa_id
          ? formatedDate(entryInfo.coa.tested_at, 7)
          : '';
      } else {
        entryDetails['coa_id'] = '';
      }
      res.send({
        success: true,
        message: 'Your entry details',
        data: { details: entryDetails },
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getAds(req, res): Promise<any> {
    try {
      const { pageName } = req.params;
      if (pageName) {
        const getAdvertisementData = await this.advertisementRepository.find({
          where: { placement_page: pageName },
          select: ['headline', 'body', 'link', 'advertisement_image'],
        });
        res.send({
          success: true,
          message: 'Success',
          data: getAdvertisementData,
        });
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getHomeUserComment(req, res): Promise<any> {
    try {
      // const findUsers = { user_comments: { $exists: true, $ne: null } };
      const entriesComment = await this.diaryRepository
        .createQueryBuilder('diary')
        .select(['diary.id', 'diary.created_at'])
        .leftJoin('diary.product', 'product')
        .addSelect(['product.name'])
        .leftJoin('diary.user', 'user')
        .addSelect(['user.full_name'])
        .leftJoin('diary.user_comments', 'user_comments')
        .where('user_comments.entry_id=diary.id')
        .addSelect([
          'user_comments.commented_by',
          'user_comments.comment',
          'user_comments.created_at',
        ])
        .getMany();

      res.send({
        success: true,
        data: entriesComment,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getHomeEntries(req, res, query_params: any): Promise<any> {
    try {
      const entriesFrom = new Date(query_params.entriesFrom);
      const entriesTo = new Date(query_params.entriesTo);
      let findCond = { is_deleted: false, is_active: true };  
      if (!!query_params.entriesFrom && !!query_params.entriesTo) {
        // let findCond = { is_deleted: 0, is_active: 1, created_at: { $gte: entriesFrom.toDateString(), $lt: entriesTo.toDateString() }};
        findCond['created_at'] = Between(
          entriesFrom.toDateString(),
          entriesTo.toDateString(),
        );
      }
      let AllEntries = await this.diaryRepository.find({
        where: findCond,
        order: { created_at: 'ASC' },
      });
      // .sort({ created_at: 1 });

      const resultEntriesData = AllEntries.reduce((r, { created_at }) => {
        const dateObj = new Date(created_at);
        const monthyear = dateObj.toLocaleString('en-us', {
          month: 'long',
          year: 'numeric',
        });
        if (!r[monthyear]) r[monthyear] = { monthyear, entries: 1 };
        else r[monthyear].entries++;
        return r;
      }, {});
      res.send({
        success: true,
        data: resultEntriesData,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getProfileMain(req, res): Promise<any> {
    
    try {
      let dailyEntries = await this.diaryRepository
        .createQueryBuilder()
        .select(['month', 'year', 'day_of_month', 'created_at'])
        .addSelect('COUNT(created_at)', 'count')
        .groupBy('DATE(created_at)')
        .getRawMany();

      dailyEntries = dailyEntries.map((entry) => {
        return {
          _id: {
            year: entry.year,
            month: entry.month,
            day: entry.day_of_month,
          },
          created_at: entry.created_at,
          count: entry.count,
        };
      });

      let lengthEntries = 0;
      let totalEntries = 0;
      for (let e = 0; e < dailyEntries.length; e++) {
        totalEntries += dailyEntries[e].count;
        lengthEntries++;
      }
      const dailyEntriesAverage = totalEntries / lengthEntries;

      let weeklyEntries = await this.diaryRepository
        .createQueryBuilder()
        .select(['created_at', 'year'])
        .addSelect('COUNT(created_at)', 'count')
        .groupBy(
          'FROM_DAYS(TO_DAYS(created_at) -MOD(TO_DAYS(created_at) -1, 7))',
        )
        .getRawMany();

      //Grab day of the week from local computer

      weeklyEntries = weeklyEntries.map((entry) => {
        return {
          _id: {
            year: entry.year,
            week: getWeekNumber(entry.created_at),
          },
          created_at: entry.created_at,
          count: entry.count,
        };
      });

      const users = await this.userRepository
        .createQueryBuilder('user')
        .where({ dob: Not(IsNull()) })
        .select(['user.dob', 'user.id', 'user.gender'])
        .leftJoin('user.state', 'state')
        .addSelect('state.name')
        .leftJoin('user.consumption_reason', 'consumption_reason')
        .addSelect(['consumption_reason.name', 'consumption_reason.id'])
        .getMany();

      let user_age = [];
      const today = new Date();
      let length = 0;
      let total = 0;
      let user_average = 0;
      if (users.length > 0) {
        for (let i = 0; i < users.length; i++) {
          const birthDate = new Date(users[i].dob);
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          let UserEntries = '';
          user_age.push({
            id: users[i].id,
            dob: users[i].dob,
            gender: users[i].gender,
            entries: UserEntries.length,
            consumption_reason: !!users[i].consumption_reason
              ? users[i].consumption_reason.name
              : '',
            consumption_reason_id: !!users[i].consumption_reason
              ? users[i].consumption_reason.id
              : '',
            state: !!users[i].state ? users[i].state.name : '',
            age: age,
          });
          total += age;
          length++;
        }
        user_average = total / length;
      }
      let consumptionReasonTempResult = {};
      let consumptionReasonDataResult = {};
      let genderTempResult = {};
      let ageTempResult = {};
      let stateTempResult = {};

      for (let {
        id,
        consumption_reason,
        consumption_reason_id,
        age,
        gender,
        state,
      } of user_age) {
        if (consumption_reason !== '') {
          consumptionReasonTempResult[consumption_reason] = {
            consumption_reason,
            count: consumptionReasonTempResult[consumption_reason]
              ? consumptionReasonTempResult[consumption_reason].count + 1
              : 1,
          };
        } else {
          consumptionReasonTempResult['Undefined'] = {
            consumption_reason: 'Undefined',
            count: consumptionReasonTempResult['Undefined']
              ? consumptionReasonTempResult['Undefined'].count + 1
              : 1,
          };
        }
        if (consumption_reason !== '') {
          if (consumptionReasonDataResult[consumption_reason]) {
            const user_ids =
              consumptionReasonDataResult[consumption_reason].users_ids.push(
                id,
              );
            consumptionReasonDataResult[consumption_reason].total_users =
              consumptionReasonDataResult[consumption_reason].total_users + 1;
            const genders = !!gender
              ? consumptionReasonDataResult[consumption_reason].gender[
                  gender
                ].push(id)
              : '';
          } else {
            consumptionReasonDataResult[consumption_reason] = {
              users_ids: [id],
              total_users: 1,
              gender: {
                Male: [],
                Female: [],
                'Rather not say': [],
                Others: [],
              },
            };
            if (gender !== '' && !!gender) {
              consumptionReasonDataResult[consumption_reason].gender[gender] = [
                id,
              ];
            }
          }
          consumptionReasonDataResult[consumption_reason] = {
            id: consumption_reason_id,
            consumption_reason,
            total_users:
              consumptionReasonDataResult[consumption_reason].total_users,
            users_ids:
              consumptionReasonDataResult[consumption_reason].users_ids,
            gender: consumptionReasonDataResult[consumption_reason].gender,
          };
        } else {
          if (consumptionReasonDataResult['Undefined']) {
            const user_ids =
              consumptionReasonDataResult['Undefined'].users_ids.push(id);
            consumptionReasonDataResult['Undefined'].total_users =
              consumptionReasonDataResult['Undefined'].total_users + 1;
            const genders = !!gender
              ? consumptionReasonDataResult['Undefined'].gender[gender].push(id)
              : '';
          } else {
            consumptionReasonDataResult['Undefined'] = {
              users_ids: [id],
              total_users: 1,
              gender: {
                Male: [],
                Female: [],
                'Rather not say': [],
                Others: [],
              },
            };
            if (gender !== '' && !!gender) {
              consumptionReasonDataResult['Undefined'].gender[gender] = [id];
            }
          }
          consumptionReasonDataResult['Undefined'] = {
            id: 'N/A',
            consumption_reason: 'Undefined',
            total_users: consumptionReasonDataResult['Undefined'].total_users,
            users_ids: consumptionReasonDataResult['Undefined'].users_ids,
            gender: consumptionReasonDataResult['Undefined'].gender,
          };
        }
        if (gender !== '' && !!gender) {
          genderTempResult[gender] = {
            gender,
            count: genderTempResult[gender]
              ? genderTempResult[gender].count + 1
              : 1,
          };
        }
        if (age !== '' && !!age) {
          ageTempResult[age] = {
            age,
            count: ageTempResult[age] ? ageTempResult[age].count + 1 : 1,
          };
        }
        if (state !== '' && !!state) {
          stateTempResult[state] = {
            state,
            count: stateTempResult[state]
              ? stateTempResult[state].count + 1
              : 1,
          };
        }
      }
      const consumptionReasonResult: any = Object.values(
        consumptionReasonTempResult,
      );
      const genderResult = Object.values(genderTempResult);
      const ageResult = Object.values(ageTempResult);
      const stateResult: any = Object.values(stateTempResult);
      const consumptionReasonData: any = Object.values(
        consumptionReasonDataResult,
      );
      const findAllEntries = { is_active: true, is_deleted: false };
      const getAllEntries = await this.diaryRepository.find({
        where: findAllEntries,
      });
      const totalUserEntries = getAllEntries.length;
      let purposeData = [];
      let totalComsumptionReasonUsers = 0;
      let totalComsumptionReasonEntries = 0;
      let totalComsumptionReasonAveEntries = 0;
      for (let d = 0; d < consumptionReasonData.length; d++) {
        let UserEntries = await this.userRepository.find({
          where: { id: In(consumptionReasonData[d].users_ids) },
        });
        let averageRatingsTotal = 0;
        // for (let w = 0; w < UserEntries.length; w++) {
        //   if (UserEntries[w].average_ratings) {
        //     averageRatingsTotal += Number(UserEntries[w].average_ratings);
        //   } else {
        //     averageRatingsTotal += 0;
        //   }
        // }
        consumptionReasonData[d].gender = [
          {
            gender: 'Male',
            count: (!!consumptionReasonData[d].gender['Male']
              ? await this.diaryRepository.find({
                  where: {
                    user_id: In(consumptionReasonData[d].gender['Male']),
                  },
                })
              : ''
            ).length,
          },
          {
            gender: 'Female',
            count: (!!consumptionReasonData[d].gender['Female']
              ? await this.diaryRepository.find({
                  where: {
                    user_id: In(consumptionReasonData[d].gender['Female']),
                  },
                })
              : ''
            ).length,
          },
          {
            gender: 'Rather not say',
            count: (!!consumptionReasonData[d].gender['Rather not say']
              ? await this.diaryRepository.find({
                  where: {
                    user_id: In(
                      consumptionReasonData[d].gender['Rather not say'],
                    ),
                  },
                })
              : ''
            ).length,
          },
        ];

        purposeData.push({
          consumption_reason_id: consumptionReasonData[d].id,
          consumption_reason: consumptionReasonData[d].consumption_reason,
          total_users: consumptionReasonData[d].total_users,
          user_entries: UserEntries.length,
          genders: consumptionReasonData[d].gender,
          average_entries:
            Number((UserEntries.length / totalUserEntries) * 100).toFixed(2) +
            '%',
          all_users: '',
          all_entries: UserEntries,
          all_ave_entries: '',
          average_ratings: Number(averageRatingsTotal).toFixed(0),
        });
        totalComsumptionReasonUsers += consumptionReasonData[d].total_users;
        totalComsumptionReasonEntries += UserEntries.length;
        totalComsumptionReasonAveEntries += Number(
          (UserEntries.length / totalUserEntries) * 100,
        );
      }

      const profile = {
        user: {
          average: 0,
          top_reason: consumptionReasonResult.length
            ? consumptionReasonResult.reduce((max, obj) =>
                max.count > obj.count ? max : obj,
              )
            : '',
          top_location: stateResult.length
            ? stateResult.reduce((max, obj) =>
                max.count > obj.count ? max : obj,
              )
            : '',
          daily_average_entries: dailyEntriesAverage,
          consumption_reasons: purposeData,
          gender: genderResult,
          age: ageResult,
          state: stateResult,
          users: {},
          weekly_entries: weeklyEntries,
        },
      };
      profile.user.average = user_average;
      profile.user.users = user_age;
      res.send({
        success: true,
        data: profile,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updateTutorialFlag(req, res): Promise<any> {
    try {
      const userId = req.user.id;
      await this.userRepository.update(
        { id: userId },
        { show_tutorial_flag: 1 },
      );

      res.send({
        success: true,
        message: 'Information updated successfully',
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async fingerPrintLogin(req, res, body: any): Promise<any> {
    try {
      const { device_id, device_type, device_push_key } = body;
      const user = await this.userRepository
        .createQueryBuilder('user')
        // .where("user.device_ids IN (:...deviceId)", { deviceId: [device_id] })
        .where('user.device_ids like :deviceId', { deviceId: `%${device_id}%` })
        .getOne();
      // console.log({user})
      if (!user) {
        return res.send({
          success: false,
          message: 'This device is not registered with any user',
        });
      }
      let isDeactivated = false;
      if (user.is_active == 4) {
        isDeactivated = true;
        const deactivatedOn = formatedDate(user.deactivated_at, 7);
        return res.send({
          success: false,
          data: {
            is_deactivated: isDeactivated,
            deactivated_on: deactivatedOn,
          },
          message: `You have deactivated your account on ${deactivatedOn} . To use the TCD app, you will need to activate your account again.`,
        });
      }
      if (user.is_active == 0) {
        return res.send({
          success: false,
          message: 'Your account has blocked by administrator',
        });
      }
      if (user.is_active == 3) {
        return res.send({
          success: true,
          is_active: user.is_active,
          message: 'Please verify your email',
        });
      }
      const token = await this.createToken(user);

      user.device_type = device_type;
      if (device_push_key != undefined) {
        user.device_push_key = device_push_key;
      }
      await this.userRepository.save(user);

      const userInfo = await this.userRepository
        .createQueryBuilder('user')
        .where({ id: user.id })
        .select([
          'user.id',
          'user.email',
          'user.full_name',
          'user.profile_image',
          'user.contact_no',
          'user.user_type',
          'user.gender',
          'user.dob',
          'user.city',
          'user.address',
          'user.zipcode',
          'user.height',
          'user.height_scale',
          'user.weight',
          'user.weight_scale',
          'user.activity_level',
          'user.is_active',
          'user.show_tutorial_flag',
          'user.twoFA_is_on',
        ])
        .leftJoin('user.state', 'state')
        .addSelect(['state.name', 'state.id'])
        .leftJoin('user.country', 'country')
        .addSelect(['country.name', 'country.id'])
        .leftJoin('user.cannabis_consumption', 'cannabis_consumption')
        .addSelect(['cannabis_consumption.name', 'cannabis_consumption.id'])
        .leftJoin('user.physique', 'physique')
        .addSelect(['physique.name', 'physique.id'])
        .leftJoin('user.favourite_strains', 'favourite_strains')
        .addSelect(['favourite_strains.name', 'favourite_strains.id'])
        .leftJoinAndSelect('user.effect', 'effect')
        .leftJoin('effect.effect', 'effects')
        .addSelect(['effects.name', 'effects.id'])
        .leftJoinAndSelect('user.symptoms', 'symptoms')
        .leftJoin('symptoms.symptom', 'symptom')
        .addSelect(['symptom.name', 'symptom.id'])
        .leftJoinAndSelect('user.activities', 'activities')
        .leftJoin('activities.activity', 'activity')
        .addSelect(['activity.name', "'activity.id'"])
        .leftJoinAndSelect('user.cannabinoids', 'cannabinoids')
        .leftJoin('cannabinoids.cannabinoids', 'cannabinoid')
        .addSelect(['cannabinoid.name', 'cannabinoid.id'])
        .getOne();

      // //console.log(userInfo.activities)
      // let userDetails = userInfo.toObject()
      let userDetails = Object.assign(userInfo);
      userDetails.profile_image = userInfo.profile_image
        ? 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/profile_image/' +
          userInfo.profile_image
        : '';
      if (userInfo.dob) {
        userDetails.dob = formatedDate(userInfo.dob, 7);
      }
      if (userDetails.state) {
        userDetails.state = userInfo.state.id;
        userDetails.state_name = userInfo.state.name;
        userDetails.country = userInfo.state.country.id;
        userDetails.country_name = userInfo.state.country.name;
      }
      if (userInfo.cannabis_consumption) {
        userDetails.cannabis_consumption_id = userInfo.cannabis_consumption.id;
        userDetails.cannabis_consumption = userInfo.cannabis_consumption.name;
      }
      userDetails.favourite_strains_id = '';
      userDetails.favourite_strains = '';
      if (userInfo.favourite_strains) {
        userDetails.favourite_strains_id = userInfo.favourite_strains.id;
        userDetails.favourite_strains = userInfo.favourite_strains.name;
      }
      if (userInfo.physique) {
        userDetails.physique_id = userInfo.physique.id;
        userDetails.physique = userInfo.physique.name;
      }
      if (userInfo.symptoms) {
        let symptoms = [];
        for (let i = 0; i < userInfo.symptoms.length; i++) {
          symptoms.push({
            symptom_id: userInfo.symptoms[i].symptom.id,
            symptom_name: userInfo.symptoms[i].symptom.name,
          });
        }
        userDetails.symptoms = symptoms;
      }
      if (userInfo.effect) {
        let effects = [];
        for (var i = 0; i < userInfo.effect.length; i++) {
          effects.push({
            effect_id: userInfo.effect[i].effect.id,
            effect_name: userInfo.effect[i].effect.name,
          });
        }
        userDetails.effects = effects;
      }
      if (userInfo.cannabinoids) {
        let cannabinoids = [];
        for (var i = 0; i < userInfo.cannabinoids.length; i++) {
          cannabinoids.push({
            cannabinoid_id: userInfo.cannabinoids[i].cannabinoids.id,
            cannabinoid_name: userInfo.cannabinoids[i].cannabinoids.name,
          });
        }
        userDetails.cannabinoids = cannabinoids;
      }
      if (userInfo.activities) {
        let activities = [];
        for (var i = 0; i < userInfo.activities.length; i++) {
          activities.push({
            activity_id: userInfo.activities[i].activity.id,
            activity_name: userInfo.activities[i].activity.name,
          });
        }
        userDetails.activities = activities;
      }
      //check incomplete entries
      let has_incomplete_entry = false;
      let entry_id = '';

      const incompleteEntry = await this.diaryRepository.findOne({
        where: {
          user_id: userInfo.id,
          has_incompleteness_notified: 2,
          is_complete: 2,
        },
      });
      if (incompleteEntry) {
        has_incomplete_entry = true;
        entry_id = incompleteEntry.id;
      }
      res.send({
        success: true,
        message: 'You have logged in successfully',
        data: { user: userDetails, token, has_incomplete_entry, entry_id },
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async activateAccount(req, res, body: any): Promise<any> {
    try {
      const { email } = body;
      const userDetails = await this.userRepository.findOne({
        where: { email: email, is_deleted: false },
      });
      if (!userDetails) {
        return res.send({ success: false, message: 'User does not exist' });
      }
      if (userDetails.is_active == 1) {
        return res.send({
          success: false,
          message: 'This user account is an active account',
        });
      }
      const userId = userDetails.id;
      userDetails.is_active = 1;
      await this.userRepository.save(userDetails);
      await this.diaryRepository.update(
        { user_id: userId, is_deactivated: 1 },
        { is_deactivated: 0, is_deleted: false },
      );
      await this.communityQuestionRepository.update(
        { user: userId, is_deactivated: 1 },
        { is_deactivated: 0, is_deleted: false },
      );
      const token = await this.createToken(userDetails);
      if (userDetails.device_push_key) {
        sendPush(
          userDetails.device_push_key,
          'Your TCD account has been activated succesfully',
          '8',
        );
      }
      res.send({
        success: true,
        data: { token },
        message: 'This user account has been activated succesfully',
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async deactivateAccount(req, res): Promise<any> {
    try {
      const userId = req.user.id;
      let userDetails = await this.userRepository.findOne({
        where: { id: userId, is_deleted: false },
      });
      if (!userDetails) {
        return res.send({ success: false, message: 'User does not exist' });
      }
      if (userDetails.is_active == 4) {
        return res.send({
          success: false,
          message: 'This user account is already deactivated',
        });
      }
      userDetails.is_active = 4;
      userDetails.deactivated_at = new Date();
      await this.userRepository.save(userDetails);
      await this.diaryRepository.update(
        { user_id: userId, is_deleted: false, is_active: true },
        { is_deactivated: 1, is_deleted: true },
      );
      await this.communityQuestionRepository.update(
        { user: userId },
        { is_deactivated: 1, is_deleted: true },
      );
      if (userDetails.device_push_key) {
        sendPush(
          userDetails.device_push_key,
          'Your TCD account has been deactivated',
          '7',
        );
      }
      res.send({
        success: true,
        message: 'This user account has been deactivated succesfully',
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async deleteAccount(req, res): Promise<any> {
    try {
      const userId = req.user.id;
      let userDetails = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!userDetails) {
        return res.send({ success: false, message: 'User does not exist' });
      }
      if (userDetails.is_deleted) {
        return res.send({
          success: false,
          message: 'This user account does not exist',
        });
      }
      userDetails.is_deleted = true;
      userDetails.deleted_at = new Date();
      userDetails.token = '';
      await this.userRepository.save(userDetails);
      await this.diaryRepository.update(
        { user_id: userId },
        { is_deleted: true },
      );
      await this.communityQuestionRepository.update(
        { user: userId },
        { is_deleted: true },
      );
      if (userDetails.device_push_key) {
        sendPush(
          userDetails.device_push_key,
          'Your TCD account has been deleted succesfully',
          '9',
        );
      }
      res.send({
        success: true,
        message: 'This user account has been deleted succesfully',
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async reportReason(req, res): Promise<any> {
    try {
      let reportreason = [];
      const getreportReason = await this.reportReasonRepository.find({
        where: { is_deleted: false },
      });
      if (getreportReason.length > 0) {
        for (let c = 0; c < getreportReason.length; c++) {
          reportreason.push({
            id: getreportReason[c].id,
            name: getreportReason[c].name,
            description: getreportReason[c].description,
          });
        }
      }
      res.send({ success: true, data: reportreason });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getActivityGraphData(req, res, query_params: any): Promise<any> {
    try {
      const { activity_id, month } = query_params;
      if (!activity_id) {
        return res.send({
          success: false,
          message: 'Please provide activity id',
        });
      }
      if (!month) {
        return res.send({ success: false, message: 'Please provide month' });
      }

      const userId = req.user.id;
      const year = new Date().getFullYear();

      const aggregatedResult = await this.diaryRepository
        .createQueryBuilder('diary')
        .where({ user_id: userId, year: year, month: month, is_complete: 1 })
        .leftJoin('diary.pre_activities', 'pre_activities')
        .andWhere('pre_activities.activity_id= :id', { id: activity_id })
        .leftJoin('diary.consumption_method', 'type')
        .addSelect(['type.id', 'type.name'])
        .addSelect('COUNT(diary.consumption_method)', 'count')
        .groupBy('diary.consumption_method')
        .getRawMany();

      let methods = [];
      const methodlist = await this.consumtionMethodRepository.find({
        where: { type: 2, is_deleted: false, is_active: true },
        select: ['name'],
      });

      if (methodlist.length > 0) {
        for (let m = 0; m < methodlist.length; m++) {
          methods.push(methodlist[m].name);
        }
      }

      let consumptionMethodsOverview = [];
      let existingMethods = [];
      if (aggregatedResult.length > 0) {
        for (let i = 0; i < aggregatedResult.length; i++) {
          existingMethods.push(aggregatedResult[i].type_id);
          consumptionMethodsOverview.push({
            consumption_method_id: aggregatedResult[i].type_id,
            consumption_method: aggregatedResult[i].type_name,
            scale: aggregatedResult[i].count,
          });
        }
        for (let i = 0; i < methods.length; i++) {
          if (existingMethods.includes(methods[i]) === false) {
            consumptionMethodsOverview.push({
              consumption_method_id: i + 1,
              consumption_method: methods[i],
              scale: 0,
            });
          }
        }
      } else {
        for (let m = 0; m < methods.length; m++) {
          consumptionMethodsOverview.push({
            consumption_method_id: m + 1,
            consumption_method: methods[m],
            scale: 0,
          });
        }
      }

      consumptionMethodsOverview.sort(
        (a, b) => parseFloat(a.id) - parseFloat(b.id),
      );
      // /**Consumption Methods Graph Data END */
      // /**Cannabinoids  */

      const cannabinoidAggData = await this.diaryRepository
        .createQueryBuilder('diary')
        .where({ user_id: userId, year: year, month: month, is_complete: 1 })
        .leftJoin('diary.pre_activities', 'pre_activities')
        .andWhere('pre_activities.activity_id= :id', { id: activity_id })
        .leftJoin('diary.cannabinoid_profile', 'composition')
        .leftJoin('composition.composition', 'comp')
        .addSelect(['comp.id', 'comp.name'])
        .addSelect('COUNT(composition.composition_id)', 'count')
        .addSelect('SUM(composition.weight)', 'totalweight')
        .addSelect('AVG(composition.weight)', 'avgweight')
        .groupBy('composition.composition_id')
        .getRawMany();

      let cannabinoids = [];
      if (cannabinoidAggData.length > 0) {
        for (let c = 0; c < cannabinoidAggData.length; c++) {
          if (cannabinoidAggData[c].comp_id) {
            cannabinoids.push({
              cannabinoid: cannabinoidAggData[c].comp_name,
              //scale:cannabinoidAggData[c].avgweight
              scale: '0.19',
            });
          }
        }
      }
      // /**END */
      // /**Terpenes  */

      const terpenesAggData = await this.diaryRepository
        .createQueryBuilder('diary')
        .where({ user_id: userId, year: year, month: month, is_complete: 1 })
        .leftJoin('diary.pre_activities', 'pre_activities')
        .andWhere('pre_activities.activity_id= :id', { id: activity_id })
        .leftJoin('diary.terpenes', 'terpenes')
        .leftJoin('terpenes.composition', 'comp')
        .addSelect(['comp.id', 'comp.name'])
        .addSelect('COUNT(terpenes.composition_id)', 'count')
        .addSelect('SUM(terpenes.weight)', 'totalweight')
        .addSelect('AVG(terpenes.weight)', 'avgweight')
        .groupBy('terpenes.composition_id')
        .getRawMany();

      let terpenes = [];
      if (terpenesAggData.length > 0) {
        for (let c = 0; c < terpenesAggData.length; c++) {
          if (terpenesAggData[c].comp_id) {
            terpenes.push({
              terpene: terpenesAggData[c].comp_name,
              //scale:cannabinoidAggData[c].avgweight
              scale: '0.17',
            });
          }
        }
      }
      // /**END */

      const resultSet = await this.diaryRepository
        .createQueryBuilder('diary')
        .where({ user_id: userId, year: year, month: month, is_complete: 1 })
        .select(['diary.is_active'])
        .leftJoin('diary.pre_activities', 'pre_activities')
        .andWhere('pre_activities.activity_id= :id', { id: activity_id })
        .leftJoin('diary.coa', 'coa')
        .addSelect([
          'coa.total_cannabinoid_mg',
          'coa.total_terpenes_mg',
          'coa.total_THC_mg',
          'coa.total_THC_mg',
        ])
        .getMany();

      let pieData = {};
      if (resultSet.length > 0) {
        let coa = 0;
        let calculatedTHC = 0;
        let calculatedCBD = 0;
        let calculatedOthers = 0;
        for (let r = 0; r < resultSet.length; r++) {
          if (resultSet[r].coa) {
            coa++;
            var others =
              resultSet[r].coa.total_cannabinoid_mg -
              (resultSet[r].coa.total_THC_mg + resultSet[r].coa.total_CBD_mg);
            var total =
              resultSet[r].coa.total_cannabinoid_mg +
              resultSet[r].coa.total_terpenes_mg;
            if (total > 0) {
              calculatedTHC += (resultSet[r].coa.total_THC_mg / total) * 100;
              calculatedCBD += (resultSet[r].coa.total_CBD_mg / total) * 100;
              calculatedOthers += (others / total) * 100;
            }
          }
        }
        pieData = {
          THC: roundUp(calculatedTHC / coa, 2),
          CBD: roundUp(calculatedCBD / coa, 2),
          'Other Cannabinoids': roundUp(calculatedOthers / coa, 2),
          Limonene: 0.01,
          'Beta-Pinene': 0.21,
          Linalool: 0.1,
          'Other Terpenes': 0.17,
        };
      }

      res.send({
        success: true,
        data: {
          piechart_data: pieData,
          cannabinoids,
          terpenes,
          consumption_methods: consumptionMethodsOverview,
        },
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getEffectGraphData(req, res, query_params): Promise<any> {
    try {
      const { effect_id, month } = query_params;
      const userId = req.user.id;
      const year = new Date().getFullYear();
      if (!effect_id) {
        return res.send({
          success: false,
          message: 'Please provide activity id',
        });
      }
      if (!month) {
        return res.send({ success: false, message: 'Please provide month' });
      }

      /**Consumption Methods Graph Data */

      const aggregatedResult = await this.diaryRepository
        .createQueryBuilder('diary')
        .where({ user_id: userId, year: year, month: month, is_complete: 1 })
        .leftJoin('diary.actual_effects', 'actual_effects')
        .andWhere('actual_effects.effect_id= :id', { id: effect_id })
        .leftJoin('diary.consumption_method', 'type')
        .addSelect(['type.id', 'type.name'])
        .addSelect('COUNT(diary.consumption_method)', 'count')
        .groupBy('diary.consumption_method')
        .getRawMany();

      let methods = [];
      const methodlist = await this.consumtionMethodRepository.find({
        where: { type: 2, is_deleted: false, is_active: true },
        select: ['name'],
      });

      if (methodlist.length > 0) {
        for (let m = 0; m < methodlist.length; m++) {
          methods.push(methodlist[m].name);
        }
      }

      let consumptionMethodsOverview = [];
      let existingMethods = [];
      if (aggregatedResult.length > 0) {
        for (let i = 0; i < aggregatedResult.length; i++) {
          existingMethods.push(aggregatedResult[i].type_id);
          consumptionMethodsOverview.push({
            consumption_method_id: aggregatedResult[i].type_id,
            consumption_method: aggregatedResult[i].type_name,
            scale: aggregatedResult[i].count,
          });
        }
        for (let i = 0; i < methods.length; i++) {
          if (existingMethods.includes(methods[i]) === false) {
            consumptionMethodsOverview.push({
              consumption_method_id: i + 1,
              consumption_method: methods[i],
              scale: 0,
            });
          }
        }
      } else {
        for (let m = 0; m < methods.length; m++) {
          consumptionMethodsOverview.push({
            consumption_method_id: m + 1,
            consumption_method: methods[m],
            scale: 0,
          });
        }
      }

      consumptionMethodsOverview.sort(
        (a, b) => parseFloat(a.id) - parseFloat(b.id),
      );
      // /**Consumption Methods Graph Data END */
      // /**Cannabinoids  */

      const cannabinoidAggData = await this.diaryRepository
        .createQueryBuilder('diary')
        .where({ user_id: userId, year: year, month: month, is_complete: 1 })
        .leftJoin('diary.actual_effects', 'actual_effects')
        .andWhere('actual_effects.effect_id= :id', { id: effect_id })
        .leftJoin('diary.cannabinoid_profile', 'composition')
        .leftJoin('composition.composition', 'comp')
        .addSelect(['comp.id', 'comp.name'])
        .addSelect('COUNT(composition.composition_id)', 'count')
        .addSelect('SUM(composition.weight)', 'totalweight')
        .addSelect('AVG(composition.weight)', 'avgweight')
        .groupBy('composition.composition_id')
        .getRawMany();

      let cannabinoids = [];
      if (cannabinoidAggData.length > 0) {
        for (let c = 0; c < cannabinoidAggData.length; c++) {
          if (cannabinoidAggData[c].comp_id) {
            cannabinoids.push({
              cannabinoid: cannabinoidAggData[c].comp_name,
              //scale:cannabinoidAggData[c].avgweight
              scale: '0.19',
            });
          }
        }
      }
      // /**END */
      // /**Terpenes  */

      const terpenesAggData = await this.diaryRepository
        .createQueryBuilder('diary')
        .where({ user_id: userId, year: year, month: month, is_complete: 1 })
        .leftJoin('diary.actual_effects', 'actual_effects')
        .andWhere('actual_effects.effect_id= :id', { id: effect_id })
        .leftJoin('diary.terpenes', 'terpenes')
        .leftJoin('terpenes.composition', 'comp')
        .addSelect(['comp.id', 'comp.name'])
        .addSelect('COUNT(terpenes.composition_id)', 'count')
        .addSelect('SUM(terpenes.weight)', 'totalweight')
        .addSelect('AVG(terpenes.weight)', 'avgweight')
        .groupBy('terpenes.composition_id')
        .getRawMany();

      let terpenes = [];
      if (terpenesAggData.length > 0) {
        for (let c = 0; c < terpenesAggData.length; c++) {
          if (terpenesAggData[c].comp_id) {
            terpenes.push({
              terpene: terpenesAggData[c].comp_name,
              //scale:cannabinoidAggData[c].avgweight
              scale: '0.17',
            });
          }
        }
      }
      // /**END */

      const resultSet = await this.diaryRepository
        .createQueryBuilder('diary')
        .where({ user_id: userId, year: year, month: month, is_complete: 1 })
        .select(['diary.is_active'])
        .leftJoin('diary.actual_effects', 'actual_effects')
        .andWhere('actual_effects.effect_id= :id', { id: effect_id })
        .leftJoin('diary.coa', 'coa')
        .addSelect([
          'coa.total_cannabinoid_mg',
          'coa.total_terpenes_mg',
          'coa.total_THC_mg',
          'coa.total_THC_mg',
        ])
        .getMany();

      let pieData = {};
      if (resultSet.length > 0) {
        let coa = 0;
        let calculatedTHC = 0;
        let calculatedCBD = 0;
        let calculatedOthers = 0;
        for (let r = 0; r < resultSet.length; r++) {
          if (resultSet[r].coa) {
            coa++;
            var others =
              resultSet[r].coa.total_cannabinoid_mg -
              (resultSet[r].coa.total_THC_mg + resultSet[r].coa.total_CBD_mg);
            var total =
              resultSet[r].coa.total_cannabinoid_mg +
              resultSet[r].coa.total_terpenes_mg;
            if (total > 0) {
              calculatedTHC += (resultSet[r].coa.total_THC_mg / total) * 100;
              calculatedCBD += (resultSet[r].coa.total_CBD_mg / total) * 100;
              calculatedOthers += (others / total) * 100;
            }
          }
        }
        pieData = {
          THC: roundUp(calculatedTHC / coa, 2),
          CBD: roundUp(calculatedCBD / coa, 2),
          'Other Cannabinoids': roundUp(calculatedOthers / coa, 2),
          Limonene: 0.01,
          'Beta-Pinene': 0.21,
          Linalool: 0.1,
          'Other Terpenes': 0.17,
        };
      }

      res.send({
        success: true,
        data: {
          piechart_data: pieData,
          cannabinoids,
          terpenes,
          consumption_methods: consumptionMethodsOverview,
        },
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getFavouriteEntries(req, res): Promise<any> {
    try {
      const {
        page,
        is_public,
        ratings,
        search_date_from,
        search_date_to,
        search_text,
      } = req.query;
      const userId = req.user.id;
      let limit = 20;
      let skip = 0;
      let total = 0;
      let totalPages = 0;
      let findCond = { user_id: userId, is_deleted: false, is_favourite: 1 };
      if (is_public) {
        findCond['is_public'] = is_public;
      }
      if (ratings) {
        findCond['average_ratings'] = ratings;
      }
      if (search_date_from && search_date_to) {
        let start = new Date(search_date_from);
        start.setHours(0, 0, 0, 0);

        let end = new Date(search_date_to);
        end.setHours(23, 59, 59, 999);

        findCond['created_at'] = Between(
          MoreThanOrEqual(start),
          LessThanOrEqual(end),
        );
      }
      if (search_text) {
        let searchQuery = search_text;
        // let searchText = new RegExp(["^", searchQuery, "$"].join(""), "i");
        //  let searchText = new RegExp(["^", searchQuery, "$"].join(""), "i");
        /*findCond.$or=[
                  {keywords:{ '$regex' : searchText, '$options' : 'i' }},
                  {name:{ '$regex' : searchText, '$options' : 'i' }}
               ]*/

        let logEntry = {
          search_terms: searchQuery,
          type: 'getFavouriteEntries',
          search_by: userId,
        };

        await this.searchLogsRepository.create(logEntry);

        const getIdsSearch = await this.diaryRepository
          .createQueryBuilder('diary')
          .where({ user_id: userId })
          .leftJoin('diary.pre_activities', 'user_preactivities')
          .leftJoin('user_preactivities.activity', 'activity')
          .orWhere('activity.name', { name: Like(`%${searchQuery}%`) })
          .leftJoin('diary.pre_symptoms', 'user_presymptoms')
          .leftJoin('user_presymptoms.symptom', 'symptom')
          .orWhere('symptom.name', { name: Like(`%${searchQuery}%`) })
          .leftJoin('diary.desired_effects', 'user_desiredeffects')
          .leftJoin('user_desiredeffects.effect', 'effect')
          .orWhere('effect.name', { name: Like(`%${searchQuery}%`) })
          .leftJoin('diary.pre_condition', 'user_preconditions')
          .leftJoin('user_preconditions.condition', 'condition')
          .orWhere('condition.name', { name: Like(`%${searchQuery}%`) })
          .select(['diary.id'])
          .getMany();

        let idsArray = getIdsSearch.map((id) => {
          return id.id;
        });

        findCond['id'] = In(idsArray);
      }
      if (page && page > 0) {
        let page = req.query.page;
        skip = (page - 1) * limit;
      }

      total = await this.diaryRepository.count({ where: findCond });

      if (total == 0) {
        return res.send({ success: false, message: 'No records available' });
      }

      totalPages = Math.ceil(total / limit);
      let entryList = await this.diaryRepository
        .createQueryBuilder('entryList')
        .where(findCond)
        .select([
          'entryList.id',
          'entryList.created_at',
          'entryList.day_of_week',
          'entryList.is_favourite',
          'entryList.enjoy_taste',
          'entryList.is_complete',
          'entryList.has_incompleteness_notified',
        ])
        .leftJoin('entryList.product', 'product')
        .addSelect([
          'product.name',
          'product.description',
          // 'product.laboratory_name',
          'product.weight',
        ])
        .leftJoin('product.strain', 'strain')
        .addSelect(['strain.name'])
        .orderBy('entryList.created_at', 'DESC')
        .take(limit)
        .skip(skip)
        .getMany();

      let entries = [];
      if (entryList.length > 0) {
        for (var i = 0; i < entryList.length; i++) {
          /*let effects = []
                  if(entryList[i].entry_id.pre_effects.length > 0){
                      for(var e=0;e<entryList[i].entry_id.pre_effects.length;e++){
                          effects.push({
                              effect_id:entryList[i].entry_id.pre_effects[e].effect_id._id,
                              effect_name:entryList[i].entry_id.pre_effects[e].effect_id.name
                          })
                      }
                  }
                  let symptoms = []
                  if(entryList[i].pre_symptoms.entry_id.length > 0){
                      for(var s=0;s<entryList[i].entry_id.pre_symptoms.length;s++){
                          symptoms.push({
                              symptom_id:entryList[i].entry_id.pre_symptoms[s].symptom_id._id,
                              symptom_name:entryList[i].entry_id.pre_symptoms[s].symptom_id.name
                          })
                      }
                  }
                  let activities = []
                  if(entryList[i].pre_activities.entry_id.length > 0){
                      for(var a=0;a<entryList[i].entry_id.pre_activities.length;a++){
                          activities.push({
                              activity_id:entryList[i].entry_id.pre_activities[a].activity_id._id,
                              activity_name:entryList[i].entry_id.pre_activities[a].activity_id.name
                          })
                      }
                  }*/
          entries.push({
            id: entryList[i].id,
            name: entryList[i].product ? entryList[i].product.name : '',
            strain: entryList[i].product
              ? entryList[i].product.strain
                ? entryList[i].product.strain.name
                : ''
              : '',
            //created_at:CommonHelper.formatedDate(entryList[i].created_at,7) ,
            created_at: entryList[i].created_at,
            day: entryList[i].day_of_week,
            is_favourite: entryList[i].is_favourite,
            enjoy_taste: entryList[i].enjoy_taste,
            is_complete: entryList[i].is_complete,
            has_incompleteness_notified:
              entryList[i].has_incompleteness_notified,
          });
        }
      }
      res.send({
        success: true,
        message: 'Your entry list',
        data: {
          entries,
          total,
          record_per_page: limit,
          total_pages: totalPages,
        },
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async reportPublicEntries(req, res, body: any): Promise<any> {
    try {
      const { entry_id, comment, reason_id } = body;
      const userId = req.user.id;

      if (!entry_id) {
        return res.send({ success: false, message: 'Please provide entry id' });
      }

      const report = {
        entry_id: entry_id,
        comment: comment,
        report_reason: reason_id,
        reported_by: userId,
      };
      await this.reportPublicEntryRepository.save(report);
      res.send({ success: true, message: 'Reported successfully' });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async reportQuestion(req, res, body: any): Promise<any> {
    try {
      const { question_id, comment, reason_id } = body;
      const userId = req.user.id;

      if (!question_id) {
        return res.send({
          success: false,
          message: 'Please provide question id',
        });
      }

      const report = {
        question_id: question_id,
        comment: comment,
        report_reason: reason_id,
        reported_by: userId,
      };
      await this.reportQuestionRepository.save(report);
      res.send({ success: true, message: 'Reported successfully' });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async reportVideo(req, res): Promise<any> {
    try {
      const { video_id, comment, reason_id } = req.body;
      const { id } = req.user;
      if (!video_id) {
        return res.send({ success: false, message: 'Please provide video id' });
      }

      const report = {
        video_id: video_id,
        comment: comment ? comment : '',
        report_reason: reason_id,
        reported_by: id,
      };

      await this.reportVideoRepository.save(report);
      res.send({ success: true, message: 'Reported successfully' });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async addCommunityQuestionComment(req, res, body: any): Promise<any> {
    try {
      const { question_id, comment } = body;
      const userId = req.user.id;

      if (!question_id) {
        return res.send({
          success: false,
          message: 'Please provide question id',
        });
      }
      if (!comment) {
        return res.send({ success: false, message: 'Please provide comment' });
      }

      const qInfo = await this.communityQuestionRepository.findOne({
        where: { id: question_id, is_active: true },
      });
      if (!qInfo) {
        return res.send({ success: false, message: 'Question does not exist' });
      }
      await this.communityCommentsRepository.save({
        question_id,
        comment,
        commented_by: userId,
      });
      res.send({ success: true, message: 'Comment added successfully' });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async verify2FACode(req, res, body: any): Promise<any> {
    try {
      const { twoFA_code } = body;
      const userId = req.user.id;

      if (!twoFA_code) {
        return res.send({ success: false, message: '' });
      }

      const userInfo = await this.userRepository.findOne({
        where: { id: userId, twoFA_verification_code: twoFA_code },
      });
      if (!userInfo) {
        req.user.token = '';
        await req.user.save();
        return res.send({
          success: false,
          message: 'Sorry! we could not found a match.',
        });
      }
      userInfo.twoFA_verification_code = '';
      await this.userRepository.save(userInfo);
      res.send({ success: true, message: 'Verified successfully' });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async reportSpam(req, res, body: any): Promise<any> {
    try {
      const userId = req.user.id;
      const { video_id, comment_id, reason_id } = body;

      if (!video_id) {
        return res.send({ success: false, message: 'Please provide video id' });
      }
      if (!comment_id) {
        return res.send({
          success: false,
          message: 'Please provide comment id',
        });
      }

      const report = {
        video_id,
        comment_id,
        report_reason: reason_id,
        reported_by: userId,
      };
      await this.reportedCommentRepository.save(report);
      await this.videoCommentRepository.update(
        { video_id, id: comment_id },
        { reported_count: 1 },
      );
      res.send({ success: true, message: 'Reported successfully' });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getConsumptionMethods(
    req,
    res,
    category_id: string,
  ): Promise<any> {
    try {
      let consumptionMethods = [];
      let findCond = { type: 2, is_active: true, is_deleted: false };
      if (category_id) {
        findCond['parent_method_id'] = category_id;
      }
      const methods = await this.consumtionMethodRepository.find({
        where: findCond,
        relations: ['measurement_units', 'measurement_scales'],
      });

      if (methods.length > 0) {
        const imagePath =
          'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/methods/';

        for (let i = 0; i < methods.length; i++) {
          let subcategories = [];
          const subcategoryList = await this.consumtionMethodRepository
            .createQueryBuilder('method')
            .where({
              parent_method_id: methods[i].id,
              is_deleted: false,
              is_active: true,
            })
            .leftJoinAndSelect('method.measurement_units', 'measurement_units')
            .leftJoinAndSelect(
              'method.measurement_scales',
              'measurement_scales',
            )
            .getMany();

          if (subcategoryList.length > 0) {
            for (let sc = 0; sc < subcategoryList.length; sc++) {
              let subcatgMeasurementScale = [];
              if (
                subcategoryList[sc].measurement_scales &&
                subcategoryList[sc].measurement_scales.length > 0
              ) {
                for (
                  let s = 0;
                  s < subcategoryList[sc].measurement_scales.length;
                  s++
                ) {
                  subcatgMeasurementScale.push(
                    subcategoryList[sc].measurement_scales[s].scale,
                  );
                }
              }
              subcategories.push({
                _id: subcategoryList[sc].id,
                name: subcategoryList[sc].name,
                icon: subcategoryList[sc].icon
                  ? imagePath + subcategoryList[sc].icon
                  : '',
                measurement_unit: subcategoryList[sc].measurement_unit,
                measurement_scales: subcatgMeasurementScale,
              });
            }
          }
          let measurementScale = [];

          if (
            methods[i].measurement_scales &&
            methods[i].measurement_scales.length > 0
          ) {
            for (let s = 0; s < methods[i].measurement_scales.length; s++) {
              measurementScale.push(methods[i].measurement_scales[s].scale);
            }
          }

          consumptionMethods.push({
            _id: methods[i].id,
            name: methods[i].name,
            icon: methods[i].icon ? imagePath + methods[i].icon : '',
            measurement_unit: methods[i].measurement_unit,
            measurement_scales: measurementScale,
            subcategories,
          });
        }
      }
      res.send({
        success: true,
        message: '',
        data: { consumption_methods: consumptionMethods },
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getSymptomsGraphData(req, res, query_params: any): Promise<any> {
    try {
      const { symptom_id, month } = query_params;
      console.log({query_params});
      if (!symptom_id) {
        return res.send({ success: false, message: "Please provide symptom id" });
      }
      if (!month) {
        return res.send({ success: false, message: "Please provide month" });
      }

      const userId = req.user.id;
      const year = new Date().getFullYear();

      /** Consumption Methods Graph Data START */
      const aggregatedResult = await this.diaryRepository
      .createQueryBuilder('diary')
      .where({ user_id: userId, year: year, month: month, is_complete: 1 })
      .leftJoin('diary.pre_symptoms', 'pre_symptoms')
      .andWhere('pre_symptoms.symptom_id= :id', { id: symptom_id })
      .leftJoin('diary.consumption_method', 'type')
      .addSelect(["type.id","type.name"])
      .addSelect('COUNT(diary.consumption_method)', 'count')
      .groupBy('diary.consumption_method')
      .getRawMany();
      console.log({aggregatedResult});

      let methods = [];
      const methodlist = await this.consumtionMethodRepository.find({
        where: { type: 2, is_deleted: false, is_active: true },
        select: ['name'],
      });
      console.log({methodlist});
      if (methodlist.length > 0) {
        for (let m = 0; m < methodlist.length; m++) {
          methods.push(methodlist[m].name);
        }
      }
      console.log({methods});

      let consumptionMethodsOverview = [];
      let existingMethods = [];
      if (aggregatedResult.length > 0) {
        for (let i = 0; i < aggregatedResult.length; i++) {
          existingMethods.push(aggregatedResult[i].type_name);
          consumptionMethodsOverview.push({
            consumption_method_id: aggregatedResult[i].type_id,
            consumption_method: aggregatedResult[i].type_name,
            scale: aggregatedResult[i].count,
          });
        }
        console.log({existingMethods})
        for (let i = 0; i < methods.length; i++) {
          if (existingMethods.includes(methods[i]) === false) {
            consumptionMethodsOverview.push({
              consumption_method_id: (i + 1),
              consumption_method: methods[i],
              scale: 0,
            });
          }
        }
      } else {
        for (let m = 0; m < methods.length; m++) {
          consumptionMethodsOverview.push({
            consumption_method_id: (m + 1),
            consumption_method: methods[m],
            scale: 0,
          });
        }
      }
        console.log({consumptionMethodsOverview})
        consumptionMethodsOverview.sort((a, b) => parseFloat(a.id) - parseFloat(b.id));
        /**Consumption Methods Graph Data END */

        /**Cannabinoids  */
        const cannabinoidAggData = await this.diaryRepository
        .createQueryBuilder('diary')
        .where({ user_id: userId, year: year, month: month, is_complete: 1 })
        .leftJoin('diary.pre_symptoms', 'pre_symptoms')
        .andWhere('pre_symptoms.symptom_id= :id', { id: symptom_id })
        .leftJoin('diary.cannabinoid_profile', 'composition')
        .leftJoin('composition.composition', 'comp')
        .addSelect(['comp.id', 'comp.name'])
        .addSelect('COUNT(composition.composition_id)', 'count')
        .addSelect('SUM(composition.weight)', 'totalweight')
        .addSelect('AVG(composition.weight)', 'avgweight')
        .groupBy('composition.composition_id')
        .getRawMany();
        console.log({cannabinoidAggData});

        let cannabinoids = [];
        if (cannabinoidAggData.length > 0) {
          for (let c = 0; c < cannabinoidAggData.length; c++) {
            cannabinoids.push({
              // cannabinoid: cannabinoidAggData[c].composition.name,
              cannabinoid: cannabinoidAggData[c].comp_name,
              //scale:cannabinoidAggData[c].avgweight
              scale: "0.19",
            });
          }
        }
        console.log({cannabinoids})
        /**END */


        /**Terpenes  */
        const terpenesAggData = await this.diaryRepository
       .createQueryBuilder('diary')
       .where({ user_id: userId, year: year, month: month, is_complete: 1 })
       .leftJoin('diary.pre_symptoms', 'pre_symptoms')
       .andWhere('pre_symptoms.symptom_id= :id', { id: symptom_id })
       .leftJoin('diary.terpenes', 'terpenes')
       .leftJoin('terpenes.composition', 'comp')
       .addSelect(['comp.id', 'comp.name'])
       .addSelect('COUNT(terpenes.composition_id)', 'count')
       .addSelect('SUM(terpenes.weight)', 'totalweight')
       .addSelect('AVG(terpenes.weight)', 'avgweight')
       .groupBy('terpenes.composition_id')
       .getRawMany();
       console.log({terpenesAggData});

      let terpenes = [];
      if (terpenesAggData.length > 0) {
        for (let c = 0; c < terpenesAggData.length; c++) {
          terpenes.push({
            // terpene: terpenesAggData[c].composition.name,
            terpene: terpenesAggData[c].comp_name,
            //scale:cannabinoidAggData[c].avgweight
            scale: "0.17",
          });
        }
      }
      console.log({terpenes});
      /**END */

      /**Resultset START */
      const resultSet = await this.diaryRepository
      .createQueryBuilder('diary')
      .where({ user_id: userId, year: year, month: month, is_complete: 1 })
      .select(['diary.is_active'])
      .leftJoin('diary.pre_symptoms', 'pre_symptoms')
      .andWhere('pre_symptoms.symptom_id= :id', { id: symptom_id })
      .leftJoin('diary.coa', 'coa')
      .addSelect([
        'coa.total_cannabinoid_mg',
        'coa.total_terpenes_mg',
        'coa.total_THC_mg',
        'coa.total_CBD_mg',
      ])
      .getMany();
       console.log({resultSet});
       /**Resultset END */

       /**Pie Chart Data START */
      let pieData = {};
      if (resultSet.length > 0) {
        let coa = 0;
        let calculatedTHC = 0;
        let calculatedCBD = 0;
        let calculatedOthers = 0;
        for (let r = 0; r < resultSet.length; r++) {
          if (resultSet[r].coa) {
            coa++;
            let others =
              resultSet[r].coa.total_cannabinoid_mg -
              (resultSet[r].coa.total_THC_mg + resultSet[r].coa.total_CBD_mg);
            let total =
              resultSet[r].coa.total_cannabinoid_mg +
              resultSet[r].coa.total_terpenes_mg;
            if (total > 0) {
              calculatedTHC += (resultSet[r].coa.total_THC_mg / total) * 100;
              calculatedCBD += (resultSet[r].coa.total_CBD_mg / total) * 100;
              calculatedOthers += (others / total) * 100;
            }
          }
        }
        pieData = {
          THC: roundUp(calculatedTHC / coa, 2),
          CBD: roundUp(calculatedCBD / coa, 2),
          "Other Cannabinoids": roundUp(calculatedOthers / coa, 2),
          Limonene: 0.01,
          "Beta-Pinene": 0.21,
          Linalool: 0.1,
          "Other Terpenes": 0.17,
        };
      }
      console.log({pieData});
      /**Pie Chart Data END */

      res.send({
        success: true,
        data: {
          piechart_data: pieData,
          cannabinoids,
          terpenes,
          consumption_methods: consumptionMethodsOverview,
        },
      });

    } catch (err) {
      console.log({err})
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createToken(user: any): Promise<any> {
    const jwt_expiry = this.configService.get('jwt');
    return {
      expiresIn: jwt_expiry.expiry,
      accessToken: this.jwtService.sign({
        id: user.id,
        email: user.email,
      }),
    };
  }
}
