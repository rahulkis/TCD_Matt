import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Diary } from '../../../entity/diary.entity';
import { PartnerSupport } from '../../../entity/partnersupport.entity';
import { Product } from '../../../entity/product.entity';
import {
  Repository,
  IsNull,
  Not,
  Like,
  LessThan,
  MoreThanOrEqual,
  Between,
  Any,
  In,
  LessThanOrEqual,
} from 'typeorm';
import { Partner } from '../../../entity/partner.entity';
import { User } from '../../../entity/user.entity';
import { Coa } from '../../../entity/coa.entity';
import { formatedDate } from '../../../helpers/common.helper';
import bcrypt from 'bcryptjs';
import { PartnerLogging } from '../../../entity/partner-logging.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ProductType } from '../../../entity/product-type.entity';
import _ from 'lodash';
import { ConsumptionReason } from '../../../entity/consumptionreason.entity';
import { Campaign } from '../../../entity/campaign.entity';
import { Strain } from '../../../entity/strain.entity';
import { Effects } from '../../../entity/effects.entity';
import moment from 'moment';
import { Advertisement } from '../../../entity/advertisement.entity';
import { AwsService } from '../../../services/aws-service';
import { Country } from '../../../entity/country.entity';
import { State } from '../../../entity/state.entity';
import { TCDUpdates } from '../../../entity/tcd-updates.entity';
import { Symptoms } from '../../../entity/symptoms.entity';
import { Activity } from '../../../entity/activities.entity';
import { Conditions } from '../../../entity/conditions';
const randomstring = require('randomstring');
import {
  sendForgotPasswordEmail,
  partnerSupportEmail,
} from '../../../helpers/mail.helper';
import { ReferralCode } from 'src/entity/referral_code.entity';

@Injectable()
export class PartnerapiService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly awsService: AwsService,

    @InjectRepository(PartnerSupport)
    private readonly partnerSupportRepository: Repository<PartnerSupport>,
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Coa)
    private readonly coaRepository: Repository<Coa>,
    @InjectRepository(PartnerLogging)
    private readonly partnerLoggingRepository: Repository<PartnerLogging>,
    @InjectRepository(ProductType)
    private readonly productTypeRepository: Repository<ProductType>,
    @InjectRepository(ConsumptionReason)
    private readonly consumptionReasonRepository: Repository<ConsumptionReason>,
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(Strain)
    private readonly strainRepository: Repository<Strain>,
    @InjectRepository(Effects)
    private readonly effectsRepository: Repository<Effects>,
    @InjectRepository(Symptoms)
    private readonly symptomsRepository: Repository<Symptoms>,
    @InjectRepository(Conditions)
    private readonly conditionsRepository: Repository<Conditions>,
    @InjectRepository(Advertisement)
    private readonly advertisementRepository: Repository<Advertisement>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
    @InjectRepository(TCDUpdates)
    private readonly tcdUpdatesRepository: Repository<TCDUpdates>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(Conditions)
    private readonly conditionRepository: Repository<Conditions>,
    @InjectRepository(ReferralCode)
    private readonly referralCodeRepository: Repository<ReferralCode>,
  ) {}

  public async partnerSupport(body: any, res): Promise<any> {
    try {
      const { subject, topic, message, name, _id } = body;

      await this.partnerSupportRepository
        .save({ partner_id: _id, subject, topic, message })
        .then((response) => {
          if (response) {
            res.send({
              success: true,
              message: 'Our support will contact you shortly',
            });

            const emailData = {
              name,
              subject,
              topic,
              message,
            };
            partnerSupportEmail(emailData);
          }
        });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async homeData(userId: any, res): Promise<any> {
    try {
      const totalEntries = await this.diaryRepository.count({
        where: {
          is_active: true,
          is_deleted: false,
        },
      });
      const totalProducts = await this.productRepository.count({
        where: { is_deleted: false },
      });
      const uniqueUsers = await this.partnerRepository.count({
        where: { partner_type: 2 },
      });
      const objList = {
        totalEntries,
        totalProducts,
        uniqueUsers,
      };
      res.send({
        success: true,
        message: 'Home data',
        data: objList,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async profilePurpose(req, res): Promise<any> {
    try {
      const {
        purposefrom: queryPurposeDateFrom,
        purposeTo: queryPurposeDateTo,
        purposeId,
      } = req.query;

      const queryPurposeId = !!purposeId ? purposeId : null;

      let findUsers = {};
      if (!!queryPurposeDateFrom && !!queryPurposeDateTo) {
        if (!!queryPurposeId) {
          findUsers = {
            dob: Not(IsNull()),
            consumption_reason: purposeId,
            created_at: Between(
              MoreThanOrEqual(queryPurposeDateFrom),
              LessThan(queryPurposeDateTo),
            ),
          };
        } else {
          findUsers = {
            dob: Not(IsNull()),
            created_at: Between(
              MoreThanOrEqual(queryPurposeDateFrom),
              LessThan(queryPurposeDateTo),
            ),
          };
        }
      } else {
        if (!!queryPurposeId) {
          findUsers = {
            dob: Not(IsNull()),
            consumption_reason: purposeId,
          };
        } else {
          findUsers = {
            dob: Not(IsNull()),
          };
        }
      }

      const users = await this.userRepository
        .createQueryBuilder('users')
        .where(findUsers)
        .select(['users.id', 'users.gender', 'users.consumption_reason'])
        .leftJoin('users.consumption_reason', 'consumption_reason')
        .addSelect(['consumption_reason.name'])
        .getMany();
      const user_age = [];
      if (users.length > 0) {
        for (let i = 0; i < users.length; i++) {
          user_age.push({
            id: users[i].id,
            gender: users[i].gender,
            consumption_reason: !!users[i].consumption_reason
              ? users[i].consumption_reason.name
              : '',
          });
        }
      }
      const consumptionReasonDataResult = {};
      try {
        for (const { id, gender, consumption_reason } of user_age) {
          if (consumption_reason !== '') {
            if (consumptionReasonDataResult[consumption_reason]) {
              const user_ids =
                consumptionReasonDataResult[consumption_reason].users_ids.push(
                  id,
                );
              consumptionReasonDataResult[consumption_reason].total_users =
                consumptionReasonDataResult[consumption_reason].total_users + 1;
              const genders =
                !!consumptionReasonDataResult[consumption_reason].gender[
                  gender
                ] && !!gender
                  ? consumptionReasonDataResult[consumption_reason].gender[
                      gender
                    ].push(id)
                  : '';
            } else {
              consumptionReasonDataResult[consumption_reason] = {
                users_ids: [id],
                total_users: 1,
                gender: { Male: [], Female: [], 'Rather not say': [] },
              };
              if (gender !== '' && !!gender) {
                consumptionReasonDataResult[consumption_reason].gender[gender] =
                  [id];
              }
            }
            consumptionReasonDataResult[consumption_reason] = {
              consumption_reason,
              total_users:
                consumptionReasonDataResult[consumption_reason].total_users,
              users_ids:
                consumptionReasonDataResult[consumption_reason].users_ids,
              gender: consumptionReasonDataResult[consumption_reason].gender,
            };
          }
        }
      } catch (e) {
        console.log(e);
      }
      const consumptionReasonData = Object.values(consumptionReasonDataResult);
      const findAllEntries = { is_active: true, is_deleted: false };
      const getAllEntries = await this.diaryRepository.find({
        where: findAllEntries,
        select: ['id', 'average_ratings'],
      });

      const totalUserEntries = getAllEntries.length;
      const purposeData = [];
      const totalComsumptionReasonUsers = 0;
      const totalComsumptionReasonEntries = 0;
      const totalComsumptionReasonAveEntries = 0;
      for (let d = 0; d < consumptionReasonData.length; d++) {
        // let findUserEntries = {
        //   user_id: Any([consumptionReasonData[d]users_ids]),
        // };
        const UserEntries = await this.diaryRepository
          .createQueryBuilder('UserEntries')
          // .  where(findUserEntries)
          .select([
            'UserEntries.id',
            'UserEntries.average_ratings',
            'UserEntries.created_at',
          ])
          .leftJoin('UserEntries.user', 'user')
          .addSelect(['user.full_name'])
          .getMany();
        let averageRatingsTotal = 0;
        for (let w = 0; w < UserEntries.length; w++) {
          if (UserEntries[w].average_ratings) {
            averageRatingsTotal += Number(UserEntries[w].average_ratings);
          } else {
            averageRatingsTotal += 0;
          }
        }
        consumptionReasonData[d]['gender'] = [
          {
            gender: 'Male',
            count: (!!consumptionReasonData[d]['gender']['Male']
              ? await this.diaryRepository.find({
                  where: {
                    user: Any([consumptionReasonData[d]['gender']['Male']]),
                  },
                })
              : ''
            ).length,
          },
          {
            gender: 'Female',
            count: (!!consumptionReasonData[d]['gender']['Female']
              ? await this.diaryRepository.find({
                  where: {
                    user: Any([consumptionReasonData[d]['gender']['Female']]),
                  },
                })
              : ''
            ).length,
          },
          {
            gender: 'Rather not say',
            count: (!!consumptionReasonData[d]['gender']['Rather not say']
              ? await this.diaryRepository.find({
                  where: {
                    user: Any([
                      consumptionReasonData[d]['gender']['Rather not say'],
                    ]),
                  },
                })
              : ''
            ).length,
          },
        ];
        purposeData.push({
          consumption_reason: consumptionReasonData[d]['consumption_reason'],
          all_entries: UserEntries,
          total_users: consumptionReasonData[d]['total_users'],
          user_entries: UserEntries.length,
          genders: consumptionReasonData[d]['gender'],
          average_entries:
            Number((UserEntries.length / totalUserEntries) * 100).toFixed(2) +
            '%',
          // average_ratings: Number(averageRatingsTotal / w).toFixed(0),
          average_ratings: Number(
            // averageRatingsTotal / UserEntries.length,
            averageRatingsTotal,
          ).toFixed(0),
        });
        // totalComsumptionReasonUsers += consumptionReasonData[d]['total_users'];
        // totalComsumptionReasonEntries += UserEntries.length;
        // totalComsumptionReasonAveEntries = Number(
        //   totalComsumptionReasonAveEntries +
        //     Number((UserEntries.length / totalUserEntries) * 100).toFixed(2),
        // );
      }

      const profile = {
        user: {
          consumption_reasons: purposeData,
        },
      };

      res.send({
        success: true,
        data: profile,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getPartnerEntriesInfo(req, res): Promise<any> {
    try {
      const { entryId, userId } = req.params;
      const findCond = {
        is_active: 1,
        is_deleted: 0,
        id: entryId,
      };
      const totalEntries = await this.diaryRepository.count({
        where: { user_id: userId },
      });

      const entry = await this.diaryRepository
        .createQueryBuilder('entry')
        .where(findCond)
        .leftJoin('entry.user', 'user')
        .addSelect(['user.full_name', 'user.gender', 'user.dob'])
        .leftJoin('user.consumption_reason', 'consumption_reason')
        .addSelect(['consumption_reason.name'])
        .leftJoin('entry.product', 'product')
        .addSelect(['product.name', 'product.COA_identifier'])
        .leftJoin('product.product_type', 'product_type')
        .addSelect(['product_type.name'])
        .leftJoin('entry.user_comments', 'user_comments')
        .getOne();

      const coaData = await this.coaRepository.findOne({
        where: {
          coa_no: entry.product.COA_identifier,
        },
        select: ['batch_id', 'producer_name', 'distributor_name', 'tested_at'],
      });

      const entryObj = {
        userId: entry.user.id ? entry.user.id : '',
        entry_id: entry.id ? entry.id : '',
        userName: entry.user.full_name ? entry.user.full_name : '',
        product: entry.product.name ? entry.product.name : '',
        product_type: entry.product.product_type
          ? entry.product.product_type.name
          : '',
        average_rating: entry.average_ratings ? entry.average_ratings : '',
        createdAt: entry.created_at,
        gender: entry.user.gender ? entry.user.gender : '-',
        dob: entry.user.dob ? entry.user.dob : '-',
        batch_id: coaData ? coaData.batch_id : '-',
        producer_name: coaData ? coaData.producer_name : '-',
        distributor_name: coaData ? coaData.distributor_name : '-',
        tested_at: coaData ? coaData.tested_at : '',
        consumption_reason: entry.user.consumption_reason
          ? entry.user.consumption_reason.name
          : '-',
        totalEntries,
        isLikeDislike: entry.is_favourite,
        reviews: '',
        negatives: '',
        location: '',
        time: '',
        setting: '',
        is_public: entry.is_public,
        comments: entry.comments,
      };
      res.send({
        success: true,
        message: 'Your entry list',
        data: { entryInfo: entryObj },
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async partnerLogin(body: any, res): Promise<any> {
    try {
      const { email, password } = body;

      if (!email) {
        return res.send({ success: false, message: 'Please provide email' });
      }
      if (!password) {
        return res.send({ success: false, message: 'Please provide password' });
      }

      const partner = await this.partnerRepository.findOne({
        where: { email, is_deleted: false },
      });

      if (!partner)
        throw new HttpException('Email does not exist', HttpStatus.OK);

      const isMatch = await bcrypt.compare(password, partner.password);
      if (!isMatch)
        throw new HttpException('Invalid login credentials', HttpStatus.OK);

      let isDeactivated = false;
      if (partner.is_active == 4) {
        isDeactivated = true;
        const deactivatedOn = formatedDate(partner.deactivated_at, 7);
        return res.send({
          success: true,
          data: {
            is_deactivated: isDeactivated,
            deactivated_on: deactivatedOn,
          },
          message: `You have deactivated your account on ${deactivatedOn} . To use the Partner Portal, you will need to activate your account again.`,
        });
      }
      if (partner.is_active == 0) {
        return res.send({
          success: false,
          data: { is_deactivated: isDeactivated },
          message: 'Your account has blocked by administrator',
        });
      }
      if (partner.is_active == 3) {
        return res.send({
          success: true,
          data: { is_deactivated: isDeactivated, is_active: partner.is_active },
          message: 'Please verify your email',
        });
      }
      const token = await this.createToken(partner);
      if (token) {
        await this.partnerLoggingRepository.save({
          partner_id: partner.id,
          partner_token: token.accessToken,
        });
      }
      /** 2FA*/
      // if (partner.twoFA_is_on == 1) {
      //   const OTP = await randomstring.generate({
      //     length: 6,
      //     charset: 'alphanumeric',
      //     capitalization: 'uppercase',
      //   });
      //   let emailData = {
      //     email: partner.email,
      //     name: partner.full_name,
      //     code: OTP,
      //   };
      //   twoFactorMail(emailData);

      //   if (partner.contact_no) {
      //     var contactNO = partner.contact_no.replace(/[()\-]/g, '');
      //     var contact_no = contactNO.replace(/ /g, '');
      //     //SMSHelper.sendSMS(contact_no)
      //   }
      //   partner.twoFA_verification_code = OTP;
      // }

      /** 2FA*/
      await this.partnerRepository.save(partner);

      const partnerInfo = await this.partnerRepository.findOne({
        where: { id: partner.id },
      });

      return res.send({
        success: true,
        message: 'You have logged in successfully',
        data: {
          partnerInfo,
          token,
          is_deactivated: isDeactivated,
        },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async partnerForgotPassword(body: any, res): Promise<any> {
    try {
      const { email } = body;
      if (!email) {
        return res.send({
          success: false,
          status: 0,
          message: 'Please provide email',
        });
      }
      const partner = await this.partnerRepository.findOne({
        where: { email: email.trim() },
      });
      if (!partner) {
        return res.send({
          success: false,
          status: 0,
          message: 'User does not exist',
        });
      }
      const currentDate = formatedDate(new Date(), 7);
      if (
        partner.reset_password_attempted_on == new Date(currentDate) &&
        partner.reset_password_attempted >= 3
      ) {
        return res.send({
          success: false,
          message: 'Max number of attempt has been exceeded',
        });
      }
      const OTP = await randomstring.generate({
        length: 6,
        charset: 'alphanumeric',
        capitalization: 'uppercase',
      });
      partner.reset_password_otp = OTP;

      if (partner.reset_password_attempted_on == new Date(currentDate))
        partner.reset_password_attempted = partner.reset_password_attempted + 1;
      else partner.reset_password_attempted = 1;

      partner.reset_password_attempted_on = new Date();
      await this.partnerRepository.save(partner);
      const emailData = {
        email: partner.email,
        name: partner.full_name,
        OTP,
      };
      sendForgotPasswordEmail(emailData);

      res.send({
        success: true,
        status: 1,
        message: 'A reset password OTP has been sent to you registered email',
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async partnerResetPassword(body: any, res): Promise<any> {
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
      const checkPartner = await this.partnerRepository.findOne({
        where: { email: email.trim() },
      });
      if (!checkPartner) {
        return res.send({ success: false, message: 'Partner does not exist' });
      }
      if (checkPartner.reset_password_otp != otp) {
        return res.send({
          success: false,
          message: 'It seems that you have entered wrong OTP',
        });
      }

      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);

      checkPartner.reset_password_otp = '';
      checkPartner.reset_password_attempted = 0;
      checkPartner.password = hashPassword;

      await this.partnerRepository.save(checkPartner);
      res.send({
        success: true,
        message: 'Your password has been changed',
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async partnerSignUp(body: any, res): Promise<any> {
    try {
      const { email, referral_code } = body;
      const checkPartnerEmail = await this.partnerRepository.findOne({
        where: { email: email.trim() },
      });

      if (checkPartnerEmail) {
        return res.send({
          success: false,
          message: 'This email is already registered',
        });
      }

      if (referral_code !== null && referral_code !== '') {
        const referralCode = await this.referralCodeRepository.findOne({
          where: { code: referral_code.trim() },
        });

        if (referralCode === null) {
          return res.send({
            success: false,
            message: 'referral_code is not valid',
          });
        }

        if (referralCode.code_active !== 1) {
          return res.send({
            success: false,
            message: 'referral_code is not active',
          });
        }

        body.referral_code = referralCode.id;
      } else {
        body.referral_code = null;
      }

      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(body.password, salt);

      body.password = hashPassword;

      const partnerDetails = await this.partnerRepository.save(body);

      res.send({
        success: true,
        data: { partner: partnerDetails },
        message: 'You have registered successfully',
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async partnerLogout(token, res): Promise<any> {
    try {
      const partner = await this.partnerLoggingRepository.findOne({
        where: { partner_token: token },
      });
      if (!partner)
        return res.send({
          success: false,
          message: 'This is invalid token',
        });

      partner.is_logout = true;

      await this.partnerLoggingRepository.save(partner);

      res.send({
        success: true,
        message: 'Logout Successfully',
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getProfileDemographics(req, res): Promise<any> {
    try {
      const demographDateFrom = new Date(req.query.demographfrom);
      const demographDateTo = new Date(req.query.demographTo);
      const findUsers = {
        dob: Not(IsNull()),
      };
      if (!!req.query.demographfrom && !!req.query.demographTo) {
        // const startDate = demographDateFrom.toDateString();
        // const endDate = demographDateTo.toDateString();
        findUsers['created_at'] = Between(demographDateFrom, demographDateTo);
      }

      const users = await this.userRepository
        .createQueryBuilder('users')
        .where(findUsers)
        .select(['users.dob', 'users.id', 'users.gender'])
        .leftJoin('users.state', 'state')
        .addSelect(['state.name'])
        .leftJoin('users.consumption_reason', 'consumption_reason')
        .addSelect(['consumption_reason.name'])
        .getMany();

      const user_age = [];
      const today = new Date(),
        length = 0,
        total = 0;
      if (users.length > 0) {
        for (let i = 0; i < users.length; i++) {
          const birthDate = new Date(users[i].dob);
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          user_age.push({
            id: users[i].id,
            gender: users[i].gender,
            state: !!users[i].state ? users[i].state.name : '',
            age: age,
          });
        }
      }

      const genderTempResult = {};
      const ageTempResult = {};
      const stateTempResult = {};

      for (const { id, age, gender, state } of user_age) {
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

      const genderResult = Object.values(genderTempResult);
      const ageResult = Object.values(ageTempResult);
      const stateResult = Object.values(stateTempResult);

      const profile = {
        user: {
          gender: genderResult,
          age: ageResult,
          state: stateResult,
        },
      };

      res.send({
        success: true,
        data: profile,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getEntriesFilter(req, res): Promise<any> {
    try {
      const { page, perPageRecord, searchValue } = req.query;
      const pageRecordLimit = parseInt(perPageRecord);
      const skip = (parseInt(page) - 1) * pageRecordLimit;

      const users = await this.userRepository.find({ where: { is_active: 1 } });

      const findConditions = { is_active: true, is_deleted: false };
      if (searchValue) findConditions['name'] = Like(`%${searchValue}%`);

      const products = await this.productRepository
        .createQueryBuilder('product')
        .where(findConditions)
        .leftJoin('product.product_type', 'product-type')
        .addSelect(['product-type.name'])
        .getMany();

      const entries = await this.diaryRepository.find({
        where: findConditions,
        take: pageRecordLimit,
        skip,
      });

      const pushEntries = [];
      for (const entry of entries) {
        const product = products.find((p) => p.id == entry.product_id);

        const user = users.find((u) => u.id == entry.user_id);

        const batchId = await this.coaRepository.findOne({
          where: { coa_no: product.COA_identifier },
        });

        const objEntries = {
          userId: user.id,
          entry_id: entry.id ? entry.id : '',
          userName: user.full_name,
          product: product.name,
          product_type: product.product_type.name,
          average_rating: entry.average_ratings ? entry.average_ratings : '',
          isLikeDislike: entry.is_favourite,
          batchId,
          createdAt: entry.created_at,
          sex: user.gender,
          reviews: '',
          negatives: '',
          location: '',
          time: '',
          setting: '',
        };
        pushEntries.push(objEntries);
      }

      res.send({
        success: true,
        message: 'Your entry list',
        data: { entries: pushEntries, totalEntries: entries.length },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async partnerDeleteUser(req, res, id: any): Promise<any> {
    try {
      await this.partnerRepository
        .createQueryBuilder()
        .delete()
        .where('id = :id', id)
        .execute();
      const getUserList = await this.partnerRepository.find({
        where: { partner_type: 2 },
      });
      res.send({
        success: true,
        message: 'Deleted successfully',
        getUserList: getUserList,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async partnerGetEditUser(req, res, id): Promise<any> {
    try {
      const getUserList = await this.partnerRepository.findOne({
        where: id,
      });

      res.send({
        success: true,
        message: 'Deleted successfully',
        getUserList: getUserList,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getPartnerEntries(req, res): Promise<any> {
    try {
      const { page, perPageRecord, from, to } = req.query;
      const pageRecordLimit = parseInt(perPageRecord);
      const skip = (parseInt(page) - 1) * pageRecordLimit;

      const findCond = {
        is_active: true,
        is_deleted: false,
        created_at: (MoreThanOrEqual(new Date(from)), LessThan(new Date(to))),
      };
      const entriesTotalCount = await this.diaryRepository.count({
        where: findCond,
      });

      const entries = await this.diaryRepository
        .createQueryBuilder('entries')
        .where(findCond)
        .leftJoin('entries.user', 'user')
        .addSelect(['user.full_name', 'user.gender', 'user.dob', 'user.id'])
        .leftJoin('user.consumption_reason', 'consumption_reason')
        .addSelect(['consumption_reason.name'])
        .leftJoin('entries.product', 'product')
        .addSelect(['product.name', 'product.COA_identifier'])
        .leftJoin('product.product_type', 'product_type')
        .addSelect(['product_type.name'])
        .leftJoin('entries.user_comments', 'user_comments')
        .orderBy('entries.created_at', 'DESC')
        .skip(skip)
        .take(pageRecordLimit)
        .getMany();

      const pushEntries = [];
      for (const entry of entries) {
        const coaData = await this.coaRepository.findOne({
          where: { coa_no: entry.product.COA_identifier },
          select: ['batch_id'],
        });
        const objEntries = {
          userId: entry.user.id ? entry.user.id : '',
          entry_id: entry.id ? entry.id : '',
          userName: entry.user.full_name ? entry.user.full_name : '',
          product: entry.product.name ? entry.product.name : '',
          product_type: entry.product.product_type
            ? entry.product.product_type.name
            : '',
          consuption_reason:
            entry.user.consumption_reason && entry.user.consumption_reason.name
              ? entry.user.consumption_reason.name
              : '',
          average_rating: entry.average_ratings ? entry.average_ratings : '',
          isLikeDislike: entry.is_favourite,
          batchId: coaData ? coaData.batch_id : '-',
          createdAt: entry.created_at,
          sex: entry.user.gender ? entry.user.gender : '',
          dob: entry.user.dob ? entry.user.dob : '-',
          producer_name: coaData ? coaData.producer_name : '-',
          distributor_name: coaData ? coaData.distributor_name : '-',
          tested_at: coaData ? coaData.tested_at : '',
          reviews: '',
          negatives: '',
          location: '',
          time: '',
          setting: '',
        };
        pushEntries.push(objEntries);
      }

      res.send({
        success: true,
        message: 'Your entry list',
        data: { entries: pushEntries, totalEntries: entriesTotalCount },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async partnerGetUser(req, res): Promise<any> {
    try {
      const getUserList = await this.partnerRepository.find({
        where: { partner_type: 2 },
      });
      res.send({
        success: true,
        message: 'Partner user detail',
        getUserList: getUserList,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getObjectivesEntries(req, res): Promise<any> {
    try {
      const entryCond = { is_active: true, is_deleted: false };

      const objectivesEntries = await this.diaryRepository
        .createQueryBuilder('diary')
        .where(entryCond)
        .select(['diary.id', 'diary.created_at'])
        .leftJoinAndSelect('diary.pre_symptoms', 'pre_symptoms')
        .leftJoin('pre_symptoms.symptom', 'symptom')
        .addSelect(['symptom.name'])
        .leftJoinAndSelect('diary.desired_effects', 'desired_effects')
        .leftJoin('desired_effects.effect', 'effect')
        .addSelect(['effect.name'])
        .leftJoinAndSelect('diary.actual_effects', 'actual_effects')
        .leftJoin('actual_effects.effect', 'a_effect')
        .addSelect(['a_effect.name'])
        .leftJoinAndSelect('diary.pre_activities', 'pre_activities')
        .leftJoin('pre_activities.activity', 'activity')
        .addSelect(['activity.name'])
        .leftJoinAndSelect('diary.pre_condition', 'pre_condition')
        .leftJoin('pre_condition.condition', 'condition')
        .addSelect(['condition.name'])
        .getMany();

      const objectives = {};
      const entries = [];
      const symptomsTempResultCombined = {};
      const activityTempResultCombined = {};
      const desiredTempResultCombined = {};
      for (let i = 0; i < objectivesEntries.length; i++) {
        const symptomsTempResult = {};
        const desiredEffectsTempResult = {};
        const actualEffectsTempResult = {};
        const activityTempResult = {};
        const conditionsTempResult = {};

        for (const symp of objectivesEntries[i].pre_symptoms) {
          const symptomName = symp.symptom.name;
          const symptoms = 'symptoms';
          if (symptomName !== '' && !!symptomName) {
            symptomsTempResult[symptomName] = {
              symptomName,
              count: symptomsTempResult[symptomName]
                ? symptomsTempResult[symptomName].count + 1
                : 1,
            };
            symptomsTempResultCombined['symptoms'] = {
              symptoms,
              count: symptomsTempResultCombined['symptoms']
                ? symptomsTempResultCombined['symptoms'].count + 1
                : 1,
            };
          }
        }
        for (const act of objectivesEntries[i].pre_activities) {
          const activityName = act.activity.name;
          const activity = 'activity';
          if (activityName !== '' && !!activityName) {
            activityTempResult[activityName] = {
              activityName,
              count: activityTempResult[activityName]
                ? activityTempResult[activityName].count + 1
                : 1,
            };
            activityTempResultCombined['activity'] = {
              activity,
              count: activityTempResultCombined['activity']
                ? activityTempResultCombined['activity'].count + 1
                : 1,
            };
          }
        }

        if (objectivesEntries[i].desired_effects.length > 0) {
          for (const deseff of objectivesEntries[i].desired_effects) {
            const name = deseff.effect.name;
            if (name !== '' && !!name) {
              desiredEffectsTempResult[name] = {
                name,
                count: desiredEffectsTempResult[name]
                  ? desiredEffectsTempResult[name].count + 1
                  : 1,
              };
            }
          }
        }
        if (objectivesEntries[i].actual_effects.length > 0) {
          for (const acteff of objectivesEntries[i].actual_effects) {
            const name = acteff.effect.name;
            if (name !== '' && !!name) {
              actualEffectsTempResult[name] = {
                name,
                count: actualEffectsTempResult[name]
                  ? actualEffectsTempResult[name].count + 1
                  : 1,
              };
            }
          }
        }

        const symptomsResult = Object.values(symptomsTempResult);
        const activityResult = Object.values(activityTempResult);
        const desiredEffectsResult = Object.values(desiredEffectsTempResult);
        const actualEffectsResult = Object.values(actualEffectsTempResult);

        entries.push({
          id: objectivesEntries[i].id,
          created_at: objectivesEntries[i].created_at,
          symptoms: symptomsResult,
          desired_effect: desiredEffectsResult,
          actual_effect: actualEffectsResult,
          activities: activityResult,
        });
      }

      const symptomsResultCombined = Object.values(symptomsTempResultCombined);
      const activityResultCombined = Object.values(activityTempResultCombined);
      const resultSymptoms = _(entries)
        .groupBy(
          (x) =>
            new Date(x.created_at).getMonth() +
            1 +
            '-' +
            new Date(x.created_at).getFullYear(),
        )
        .map((value, key) => ({ date: key, entries: value }))
        .value();
      const resultActivity = _(entries)
        .groupBy(
          (x) =>
            new Date(x.created_at).getMonth() +
            1 +
            '-' +
            new Date(x.created_at).getFullYear(),
        )
        .map((value, key) => ({ date: key, entries: value }))
        .value();

      objectives['total_symptoms'] = symptomsResultCombined;
      objectives['total_symptoms'][0] = { entries: resultSymptoms };
      objectives['total_activity'] = activityResultCombined;
      objectives['total_activity'][0] = { entries: resultActivity };

      res.send({
        success: true,
        data: objectives,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getObjectivesReason(req, res): Promise<any> {
    try {
      const findCond = { is_deleted: false, is_active: true };
      const ConsumptionReasonData = await this.consumptionReasonRepository.find(
        { where: findCond, select: ['name', 'id'] },
      );
      const objectiveReasonsData = [];
      for (let i = 0; i < ConsumptionReasonData.length; i++) {
        let consumptionReasonUsersEntries;
        const consumptionReasonUsers = await this.userRepository
          .createQueryBuilder()
          .where({ consumption_reason: ConsumptionReasonData[i].id })
          .getMany();
        for (let i = 0; i < consumptionReasonUsers.length; i++) {
          consumptionReasonUsersEntries = await this.diaryRepository.find({
            where: { user_id: consumptionReasonUsers[i].id },
          });
        }
        objectiveReasonsData.push({
          consumption_reason: ConsumptionReasonData[i].name,
          user_entries: consumptionReasonUsersEntries,
        });
      }
      res.send({
        success: true,
        data: objectiveReasonsData,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getAdvertisementInfo(req, res): Promise<any> {
    try {
      const total_ads = await this.campaignRepository.count({
        where: {
          is_deleted: 0,
          is_active: true,
        },
      });
      res.send({
        success: true,
        message: 'Your entry list',
        totalAds: total_ads,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getConsumer(req, res): Promise<any> {
    try {
      const { from, to, gender, state } = req.query;

      const final_arr = [];

      const findCond = {
        is_deleted: false,
        gender,
        created_at: (MoreThanOrEqual(new Date(from)), LessThan(new Date(to))),
      };

      const users = await this.userRepository
        .createQueryBuilder('user')
        .where(findCond)
        .select(['id', 'dob'])
        .getMany();

      let product_arr = [];
      const age_arr = [];
      for (const user of users) {
        const product = await this.diaryRepository.find({
          where: { user_id: user.id },
          select: ['product_id'],
        });
        product_arr = [...product_arr, ...product];
        // age_arr.push(moment(user.dob).fromNow(true));
        age_arr.push(user.dob);
      }

      const product_id_arr = [];
      product_arr.map((pro) => {
        return product_id_arr.push(pro.product_id);
      });
      const top_products = await this.findTopFiveElement(product_id_arr);

      for (const product of top_products) {
        let total_rating = 0;
        const entries = await this.diaryRepository.count({
          where: { product_id: product },
        });
        const rating = await this.diaryRepository.find({
          where: { product_id: product },
          select: ['average_ratings'],
        });

        rating.map((pro) => {
          if (pro.average_ratings) {
            return (total_rating =
              total_rating + parseInt(pro.average_ratings));
          }
        });
        const average_rating = total_rating / rating.length;
        const product_detail = await this.diaryRepository
          .createQueryBuilder('product_detail')
          .where({ product_id: product })
          .leftJoin('product_detail.product', 'product')
          .addSelect(['product.name'])
          .leftJoin('product.product_type', 'product_type')
          .addSelect(['product_type.name'])
          .getOne();
        const brand = await this.coaRepository
          .createQueryBuilder('brand')
          .where({ product_id: product })
          .leftJoin('brand.strain', 'strain')
          .addSelect(['strain.name'])
          .getOne();

        const effects_arr = [];

        const effects = await this.diaryRepository
          .createQueryBuilder('effects')
          .where({ product_id: product })
          .leftJoin('effects.desired_effects', 'desired_effects')
          .addSelect(['desired_effects.effect_id'])
          .getMany();
        effects.map((eff) => {
          if (eff.desired_effects.length)
            eff.desired_effects.map((a) => {
              effects_arr.push(a.effect_id);
            });
        });
        const top_effect = await this.findTopElements(effects_arr);
        const effect_name = await this.effectsRepository.findOne({
          where: { id: top_effect },
          select: ['name'],
        });

        // const total_entries_of_effect = await Diary.countDocuments({
        //   desired_effects: { $elemMatch: { effect_id: top_effect } },
        // });

        const total_entries_of_effect = await this.diaryRepository.count({
          where: { id: top_effect },
        });

        const obj = {
          purpose: {
            effect: effect_name.name,
            entries: total_entries_of_effect,
          },
          age_arr,
          entries,
          average_rating,
          brand: brand ? brand.strain.name : '',
          product_name: product_detail.product
            ? product_detail.product.name
            : '',
          category: product_detail.product
            ? product_detail.product.product_type.name
            : '',
        };
        final_arr.push(obj);
      }

      res.send({
        success: true,
        message: 'Your Male Consumer list',
        consumers: final_arr,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getTopBrands(req, res): Promise<any> {
    try {
      let total_rating = 0;
      const objectives = []; //effects
      const reasons = []; //symptoms

      const final_arr = [];

      const strainFindCond = {
        is_deleted: false,
      };

      const brands = await this.strainRepository.find({
        where: strainFindCond,
        select: ['name'],
      });
      for (const brand of brands) {
        let objective;
        let reason;
        let average_rating;

        const coa = await this.coaRepository
          .createQueryBuilder('coa')
          .leftJoin('coa.strain', 'strain')
          .where('strain.name = :name', { name: brand.name })
          .leftJoinAndSelect('coa.product', 'product')
          .getMany();

        const products_arr = [];
        coa.map((p) => {
          return products_arr.push(p.product);
        });
        const top_product = await this.findTopElements(products_arr);
        const entries = await this.coaRepository.count({
          where: { product_id: top_product.id },
        });

        const product_name = await this.coaRepository
          .createQueryBuilder('coa')
          .where({ product_id: top_product.id })
          .leftJoin('coa.product', 'product')
          .addSelect(['product.name'])
          .getOne();

        const product_detail = await this.diaryRepository
          .createQueryBuilder('diary')
          .where({ product_id: top_product.id })
          .leftJoinAndSelect('diary.pre_symptoms', 'pre_symptoms')
          .leftJoinAndSelect('diary.desired_effects', 'desired_effects')
          .select(['diary.average_ratings'])
          .getMany();

        if (product_detail.length) {
          product_detail.map((pro) => {
            if (pro.average_ratings) {
              return (total_rating =
                total_rating + parseInt(pro.average_ratings));
            }
          });
          average_rating = total_rating / product_detail.length;
          //-----------------------------------------------

          //calculating objective
          product_detail.map((pro) => {
            if (pro.desired_effects.length)
              pro.desired_effects.map((e) => {
                objectives.push(e.effect_id);
              });

            return objectives;
          });
          if (objectives.length) {
            const get_top_objective = await this.findTopElements(objectives);
            objective = await this.effectsRepository.find({
              where: { id: get_top_objective },
            });
          }
          //----------------------------------------------------------

          //calculating reason
          product_detail.map((pro) => {
            if (pro.pre_symptoms.length)
              pro.pre_symptoms.map((e) => {
                reasons.push(e.symptom_id);
              });

            return reasons;
          });
          if (reasons.length) {
            const get_top_reason = await this.findTopElements(reasons);
            reason = await this.symptomsRepository.find({
              where: { id: get_top_reason },
            });
          }
          //------------------------------------------------------------
          const obj = {
            entries,
            average_rating: average_rating ? average_rating : 0,
            objective: objective ? objective.name : '',
            reason: reason ? reason.name : '',
            product_name: product_name.product ? product_name.product.name : '',
            brand_name: brand.name,
          };
          final_arr.push(obj);
        }
      }
      res.send({
        success: true,
        message: 'Your brands list',
        brands: final_arr,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async publishAds(req, res, file): Promise<any> {
    try {
      const {
        type,
        headline,
        body,
        link,
        placementPageArray,
        video_package_qty,
        total_cost,
      } = req.body;
      const { campaign_id } = req.query;

      let getImagePath;
      if (file) {
        const advertisementImage = {
          file: file,
          type: 'advertisement_image',
        };
        const response = await this.awsService.s3Upload(advertisementImage);

        getImagePath = response.Location;
      }

      const publishData = {
        type,
        headline,
        body,
        link,
        placement_page: placementPageArray.split(','),
        video_package_qty,
        total_cost,
        advertisement_image: getImagePath,
        campaign_id,
      };
      await this.advertisementRepository.save(publishData);

      res.send({
        success: true,
        message: 'Order Placed Successfully',
        data: publishData,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getRatingAndReviewsComments(req, res): Promise<any> {
    try {
      const entryCond = { is_deleted: false };
      const findUserComments = await this.diaryRepository
        .createQueryBuilder('diary')
        .where(entryCond)
        .select([
          'diary.id',
          'diary.average_ratings',
          'diary.created_at',
          'diary.comments',
        ])
        .leftJoin('diary.product', 'product')
        .addSelect(['product.name'])
        .leftJoin('diary.user', 'user')
        .addSelect(['user.id', 'user.full_name'])
        .leftJoin('diary.user_comments', 'user_comments')
        .addSelect(['user_comments.comment', 'user_comments.created_at'])
        .leftJoin('user_comments.user', 'cuser')
        .addSelect('cuser.full_name')
        .orderBy('diary.created_at', 'ASC')
        .getMany();

      const checkComments = [];
      for (let l = 0; l < findUserComments.length; l++) {
        if (
          findUserComments[l].average_ratings !== '' ||
          findUserComments[l].user_comments.length > 0
        ) {
          checkComments.push({
            id: findUserComments[l].id,
            average_ratings: findUserComments[l].average_ratings,
            product_name: findUserComments[l].product
              ? findUserComments[l].product.name
              : '',
            comments: findUserComments[l].comments,
            user_comments: findUserComments[l].user_comments,
            created_at: findUserComments[l].created_at,
            entry_owner: findUserComments[l].user
              ? findUserComments[l].user
              : '',
            entry_owner_name: findUserComments[l].user
              ? findUserComments[l].user.full_name
              : '',
          });
        }
      }
      res.send({
        success: true,
        data: checkComments,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updateCampaign(req, res): Promise<any> {
    try {
      const { id } = req.params;
      if (id) {
        await this.campaignRepository.save(id, req.body);

        res.send({
          success: true,
          message: 'Updated Successfully',
        });
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async partnerGetSetting(req, res, id: string): Promise<any> {
    try {
      const partnerDetail = await this.partnerRepository.findBy({ id });
      const country = await this.countryRepository.find({
        where: { is_deleted: false },
        select: ['name'],
        order: { name: 1 },
      });
      // .sort({ name: 1 }).select({ name: 1 });
      const states = await this.stateRepository.find({
        where: { is_deleted: false },
        select: ['name'],
        order: { name: 1 },
      });
      // .sort({ name: 1 }).select({ name: 1 });
      res.send({
        success: true,
        message: 'Partner detail',
        data: partnerDetail,
        country: country,
        states: states,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async startCampaign(req, res): Promise<any> {
    try {
      const { campaign_name, id } = req.body;
      if (id) {
        const response = await this.campaignRepository.save({
          campaign_name,
          partner_id: id,
        });
        if (response)
          res.send({ success: true, message: 'Campaign Added Successfully' });
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async partnerUpdateSetting(
    req,
    res,
    body: any,
    id: string,
  ): Promise<any> {
    try {
      const {
        full_name,
        email,
        password,
        company_name,
        company_email,
        company_phone,
        company_email_invoice,
        company_address,
        company_zipcode,
        company_state,
        company_country,
      } = body;
      const partnerDetail = await this.partnerRepository.findOne({
        where: { id },
      });
      partnerDetail.full_name = full_name;
      partnerDetail.email = email;
      if (password) {
        partnerDetail.password = password;
      }
      partnerDetail.company_name = company_name;
      partnerDetail.company_email = company_email;
      partnerDetail.company_phone = company_phone;
      partnerDetail.company_email_invoice = company_email_invoice;
      partnerDetail.company_address = company_address;
      partnerDetail.company_zipcode = company_zipcode;
      partnerDetail.company_state_Id = company_state;
      partnerDetail.company_country_Id = company_country;
      // await partnerDetail.save();
      await this.partnerRepository.save(partnerDetail);
      res.send({
        success: true,
        message: 'Partner detail',
        data: partnerDetail,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getCampaigns(req, res): Promise<any> {
    try {
      const findCond = {
        is_deleted: 0,
        is_active: true,
        // partner_id: '620cc82a3ec0520fac2b20c8',
      };
      const campaigns = await this.campaignRepository.find({
        where: findCond,
        select: ['campaign_name', 'id'],
      });
      if (campaigns)
        res.send({
          success: true,
          message: 'Your campaigns list',
          data: { campaigns },
        });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async partnerAddUser(req, res, body: any): Promise<any> {
    try {
      const { full_name, email, password } = body;
      const partnerCheckEmail = await this.partnerRepository.findOne({
        where: { email, is_deleted: false },
      });
      if (!partnerCheckEmail) {
        let hashPassword;
        if (password) {
          const salt = await bcrypt.genSalt();
          hashPassword = await bcrypt.hash(password, salt);
        }
        const result = await this.partnerRepository.save({
          full_name,
          email,
          password: hashPassword,
          partner_type: 2,
        });
        res.send({
          success: true,
          message: 'Partner Registered Successfully',
          data: result,
        });
      } else
        res.send({
          success: false,
          message: 'Email already taken',
        });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async viewCampaign(req, res): Promise<any> {
    try {
      const { campaignId } = req.params;

      const advertisementObj = {
        campaign_id: campaignId,
      };

      const response = await this.advertisementRepository
        .createQueryBuilder('advertisement')
        .where(advertisementObj)
        .leftJoin('advertisement.campaign', 'campaign')
        .addSelect(['campaign.campaign_name', 'campaign.id'])
        .getMany();

      if (response)
        res.send({
          success: true,
          message: 'Your campaigns list',
          data: response,
        });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async partnerUpdateUser(
    req,
    res,
    body: any,
    id: string,
  ): Promise<any> {
    try {
      const { full_name, email, password } = body;
      const partnerDetail = await this.partnerRepository.findOne({
        where: { id },
      });
      partnerDetail.full_name = full_name;
      partnerDetail.email = email;
      if (password) {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        partnerDetail.password = hashPassword;
      }
      await this.partnerRepository.save(partnerDetail);
      res.send({
        success: true,
        message: 'Updated Successfully',
        data: partnerDetail,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getPublishedUpdates(req, res): Promise<any> {
    try {
      const getUpdates = await this.tcdUpdatesRepository.find({
        where: { is_published: true },
      });
      res.send({
        success: true,
        data: getUpdates,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getPublishedUpdatesById(req, res, id: string): Promise<any> {
    try {
      const getUpdates = await this.tcdUpdatesRepository.findBy({ id });
      res.send({
        success: true,
        data: getUpdates,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getTopProducts(req, res, query_params: any): Promise<any> {
    try {
      const { page, perPageRecord, from, to } = query_params;

      const pageRecordLimit = parseInt(perPageRecord);
      const skip = (parseInt(page) - 1) * pageRecordLimit;

      const findCond = {
        is_deleted: false,
        created_at: (MoreThanOrEqual(new Date(from)), LessThan(new Date(to))),
      };

      const entriesTotalCount = await this.diaryRepository.count({
        where: findCond,
      });

      const products = await this.diaryRepository
        .createQueryBuilder('diary')
        .where(findCond)
        .leftJoin('diary.product', 'product')
        .addSelect(['product.id', 'product.name', 'product.COA_identifier'])
        .leftJoin('product.product_type', 'product_type')
        .addSelect(['product_type.name'])
        .limit(pageRecordLimit)
        .skip(skip)
        .getMany();
      const pushProducts = [];
      for (const product of products) {
        const producer = await this.coaRepository.findOne({
          where: {
            coa_no: product.product.COA_identifier,
          },
          select: ['producer_name'],
        });

        const totalEntriesCount = await this.coaRepository.count({
          where: {
            product_id: product.product.id,
            created_at: (MoreThanOrEqual(from), LessThan(to)),
          },
        });
        const objProduct = {
          totalEntriesCount,
          rating: product.average_ratings,
          productId: product.id,
          productName: product.product.name ? product.product.name : '',
          product_type: product.product.product_type
            ? product.product.product_type.name
            : '',
          brand: producer ? producer.producer_name : '',
        };
        pushProducts.push(objProduct);
      }
      const final_res = pushProducts.sort((a, b) => {
        return b.totalEntriesCount - a.totalEntriesCount;
      });
      res.send({
        success: true,
        message: 'Your product list',
        data: { products: final_res, totalEntries: entriesTotalCount },
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getTopActivities(req, res): Promise<any> {
    try {
      const { from, to } = req.query;

      const findCond = {
        is_deleted: false,
        created_at: (MoreThanOrEqual(new Date(from)), LessThan(new Date(to))),
      };

      const array = [];
      const activities = await this.userRepository
        .createQueryBuilder('user')
        .where(findCond)
        .leftJoinAndSelect('user.activities', 'user_activities')
        .getMany();

      activities.map((act) => {
        if (act.activities.length)
          act.activities.map((a) => {
            array.push(a.activity_id);
          });

        return array;
      });

      const get_top_activities = await this.findTopFiveElement(array);
      const activities_array = [];

      for (const activity of get_top_activities) {
        let total_rating = 0;
        const top_category_arr = [];

        const act = await this.activityRepository.findOne({
          where: { id: activity },
        });

        const entries = await this.diaryRepository
          .createQueryBuilder('diary')
          .leftJoin('diary.pre_activities', 'pre_activities')
          .where('pre_activities.activity_id = :id', { id: activity })
          .getCount();

        const product = await this.diaryRepository
          .createQueryBuilder('diary')
          .leftJoin('diary.pre_activities', 'pre_activities')
          .where('pre_activities.activity_id = :id', { id: activity })
          .distinct(true)
          .getCount();

        const rating = await this.diaryRepository
          .createQueryBuilder('diary')
          .leftJoin('diary.pre_activities', 'pre_activities')
          .where('pre_activities.activity_id = :id', { id: activity })
          .select(['average_ratings'])
          .getMany();

        rating.map((r) => {
          if (r.average_ratings)
            return (total_rating = total_rating + parseInt(r.average_ratings));
        });

        const average_rating = total_rating / rating.length;

        const age_arr = [];
        let total_age = 0;

        const age = await this.userRepository
          .createQueryBuilder('user')
          .leftJoin('user.activities', 'activities')
          .where('activities.activity_id = :id', { id: activity })
          .select(['dob'])
          .getMany();

        age.map((a) => {
          return age_arr.push(moment(a.dob).fromNow(true));
        });

        age_arr.map((ag) => {
          const get_number = ag.replace('years', '');
          total_age = total_age + parseInt(get_number);
        });
        const average_age = total_age / age_arr.length;

        const product_arr = [];
        const category_arr = [];

        const products = await this.diaryRepository
          .createQueryBuilder('diary')
          .leftJoin('diary.pre_activities', 'pre_activities')
          .where('pre_activities.activity_id = :id', { id: activity })
          .select(['product'])
          .getMany();

        products.map((p) => {
          return product_arr.push(p.product);
        });
        const top_products = await this.findTopFiveElement(product_arr);

        for (const product of top_products) {
          const category = await this.diaryRepository
            .createQueryBuilder('diary')
            .where({ product_id: product })
            .leftJoin('diary.product', 'product')
            .addSelect(['product.name'])
            .leftJoin('product.product_type', 'product_type')
            .addSelect(['product_type.name'])
            .getOne();

          const count = await this.diaryRepository.count({
            where: { product_id: product },
          });

          const category_name = category.product.product_type
            ? category.product.product_type.name
            : '';

          category_arr.push({ name: category_name, entries: count });
        }

        activities_array.push({
          name: act.name,
          entries,
          categories: category_arr,
          product: product,
          average_rating,
          average_age,
        });
      }

      res.send({
        success: true,
        message: 'Your activities list',
        activities_array,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getPartnerProductsInfo(req, res, id: string): Promise<any> {
    try {
      const findCond = { id, is_deleted: false };

      const products = await this.productRepository
        .createQueryBuilder('product')
        .where(findCond)
        .leftJoin('product.product_type', 'product_type')
        .addSelect(['product_type.name'])
        .getOne();

      const query = {
        is_active: true,
        is_deleted: false,
        product_id: products.id,
      };
      const pushProducts = [];
      const coaData = await this.coaRepository.findOne({
        where: {
          coa_no: products.COA_identifier,
        },
        select: ['batch_id', 'producer_name', 'tested_at', 'distributor_name'],
      });

      const entries = await this.diaryRepository.find({
        where: { product_id: products.id },
        select: ['average_ratings'],
      });

      let x = 0;
      let average_ratings = 0;
      for (const entry of entries) {
        x++;
        average_ratings += parseInt(entry.average_ratings);
      }
      average_ratings = average_ratings / x;

      const activities = await this.diaryRepository
        .createQueryBuilder('diary')
        .where({
          product_id: products.id,
        })
        .leftJoinAndSelect('diary.pre_activities', 'pre_activities')
        .andWhere('pre_activities.diary_id=diary.id')
        .getMany();

      const pushActivities = [];
      for (const active of activities) {
        for (const getCount of active.pre_activities) {
          const getActivitiesValue = await this.diaryRepository
            .createQueryBuilder('diary')
            .leftJoin('diary.pre_activities', 'pre_activities')
            .where('pre_activities.activity_id=:id', {
              id: getCount.activity_id,
            })
            .getCount();
          pushActivities.push(getActivitiesValue);
        }
      }
      const maxActivities = Math.max(...pushActivities);

      const preCondition = await this.diaryRepository
        .createQueryBuilder('diary')
        .where({
          product_id: products.id,
        })
        .leftJoinAndSelect('diary.pre_condition', 'pre_condition')
        .andWhere('pre_condition.diary_id=diary.id')
        .getMany();
      const pushCondition = [];
      for (const condition of preCondition) {
        for (const getCount of condition.pre_condition) {
          const getConditionValue = await this.diaryRepository
            .createQueryBuilder('diary')
            .leftJoin('diary.pre_condition', 'pre_condition')
            .where('pre_condition.condition_id=:id', {
              id: getCount.condition_id,
            })
            .getCount();
          pushCondition.push(getConditionValue);
        }
      }
      const maxCondition = Math.max(...pushCondition);

      const preEffects = await this.diaryRepository
        .createQueryBuilder('diary')
        .where({
          product_id: products.id,
        })
        .leftJoinAndSelect('diary.desired_effects', 'desired_effects')
        .andWhere('desired_effects.diary_id=diary.id')
        .getMany();

      const pushEffects = [];
      for (const effect of preEffects) {
        for (const getCount of effect.desired_effects) {
          const getEffectValue = await this.diaryRepository
            .createQueryBuilder('diary')
            .leftJoin('diary.desired_effects', 'desired_effects')
            .where('desired_effects.effect_id=:id', { id: getCount.effect_id })
            .leftJoin('diary.actual_effects', 'actual_effects')
            .andWhere('actual_effects.effect_id=:Id', {
              Id: getCount.effect_id,
            })
            .getCount();
          pushEffects.push(getEffectValue);
        }
      }

      const maxEffect = Math.max(...pushEffects);

      const entrieDetail = await this.diaryRepository
        .createQueryBuilder('diary')
        .where(query)
        .leftJoin('diary.user', 'user')
        .addSelect(['user.full_name'])
        .leftJoin('user.consumption_reason', 'consumption_reason')
        .addSelect(['consumption_reason.name'])
        .leftJoin('diary.product', 'product')
        .addSelect(['product.id', 'product.name', 'product.COA_identifier'])
        .leftJoin('product.product_type', 'product_type')
        .addSelect('product_type.name')
        .orderBy('diary.created_at', 'ASC')
        .getMany();

      const pushEntries = [];
      for (const entry of entrieDetail) {
        const coaData = await this.coaRepository.findOne({
          where: {
            coa_no: entry.product.COA_identifier,
          },
          select: ['batch_id'],
        });

        const objEntries = {
          userId: entry.user.id ? entry.user.id : '',
          consuption_reason:
            entry.user.consumption_reason && entry.user.consumption_reason.name
              ? entry.user.consumption_reason.name
              : '',
          average_rating: entry.average_ratings ? entry.average_ratings : '',
          batchId: coaData ? coaData.batch_id : '-',
          createdAt: entry.created_at,
        };
        pushEntries.push(objEntries);
      }

      const objProduct = {
        productId: products.id,
        productName: products.name ? products.name : '',
        productType: products.product_type ? products.product_type.name : '',
        batch_id: coaData ? coaData.batch_id : '-',
        producer_name: coaData ? coaData.producer_name : '-',
        tested_at: coaData ? coaData.tested_at : '',
        distributor_name: coaData ? coaData.distributor_name : '-',
        entries: entries,
        entrieDetail: entrieDetail ? entrieDetail : '',
      };
      pushProducts.push(objProduct);
      res.send({
        success: true,
        message: 'Your product list',
        data: {
          products: pushProducts,
          entriesData: pushEntries,
          maxActivities: maxActivities,
          maxEffect: maxEffect,
          maxCondition: maxCondition,
        },
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getPartnerProductFilter(
    req,
    res,
    query_params: any,
  ): Promise<any> {
    try {
      const { page, perPageRecord, searchValue, id } = query_params;
      const pageRecordLimit = parseInt(perPageRecord);
      const skip = (parseInt(page) - 1) * pageRecordLimit;
      const searchByValue = searchValue ? searchValue.toLowerCase() : '';
      const searchById = id ? id : '';
      const findCond = {
        is_deleted: false,
      };
      if (searchById) {
        findCond['product_type_id'] = searchById.toString();
      }
      if (searchByValue) {
        findCond['name'] = Like(`%${searchByValue}%`);
      }

      const entriesTotalCount = await this.productRepository.count({
        where: findCond,
      });

      const products = await this.productRepository
        .createQueryBuilder('product')
        .where(findCond)
        .leftJoin('product.product_type', 'product_type')
        .addSelect(['product_type.name'])
        .limit(pageRecordLimit)
        .skip(skip)
        .getMany();
      const pushProducts = [];
      for (const product of products) {
        const coaData = await this.coaRepository.findOne({
          where: {
            coa_no: product.COA_identifier,
          },
          select: ['batch_id'],
        });

        const objProduct = {
          productId: product.id,
          productName: product.name ? product.name : '',
          batchId: coaData ? coaData.batch_id : '-',
          product_type:
            product && product.product_type ? product.product_type.name : '',
        };
        pushProducts.push(objProduct);
      }
      res.send({
        success: true,
        message: 'Your product list',
        data: { products: pushProducts, totalEntries: entriesTotalCount },
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getTopCategories(req, res, query_params: any): Promise<any> {
    try {
      const { from, to } = query_params;
      let total_rating = 0;
      const objectives = []; //effects
      const reasons = []; //symptoms

      const final_arr = [];
      const findCond = {
        is_deleted: false,
        created_at: (MoreThanOrEqual(new Date(from)), LessThan(new Date(to))),
      };

      const entries = await this.coaRepository
        .createQueryBuilder('coa')
        .where(findCond)
        .leftJoin('coa.product', 'product')
        .addSelect(['product.id', 'product.name'])
        .leftJoin('product.product_type', 'product_type')
        .addSelect(['product_type.name'])
        .getMany();

      const productEntries = [
        ...new Set(entries.map((entry) => entry.product)),
      ];

      for (const entry of productEntries) {
        const totalEntries = await this.coaRepository.count({
          where: {
            product_id: entry.id,
            created_at: (MoreThanOrEqual(from), LessThan(to)),
          },
        });

        //calculating ratings-------------------------------

        const product_detail = await this.diaryRepository.find({
          where: { product_id: entry.id },
          select: ['average_ratings'],
          relations: ['pre_symptoms', 'desired_effects'],
        });

        product_detail.map((pro) => {
          if (pro.average_ratings) {
            return (total_rating =
              total_rating + parseInt(pro.average_ratings));
          }
        });
        const average_rating = total_rating / product_detail.length;
        //-----------------------------------------------

        //calculating objective

        product_detail.map((pro) => {
          if (pro.desired_effects.length)
            pro.desired_effects.map((e) => {
              objectives.push(e.effect_id);
            });

          return objectives;
        });
        const get_top_objective = await this.findTopElements(objectives);
        const objective = await this.effectsRepository.findOne({
          where: { id: get_top_objective },
        });
        //----------------------------------------------------------

        //calculating reason
        product_detail.map((pro) => {
          if (pro.pre_symptoms.length)
            pro.pre_symptoms.map((e) => {
              reasons.push(e.symptom_id);
            });

          return reasons;
        });
        const get_top_reason = await this.findTopElements(reasons);
        const reason = await this.symptomsRepository.findOne({
          where: { id: get_top_reason },
        });
        //------------------------------------------------------------
        const obj = {
          totalEntries,
          average_rating,
          objective: objective.name,
          reason: reason.name,
          product_name: entry.name,
          category_name: entry.product_type.name,
        };
        final_arr.push(obj);
      }
      console.log(final_arr);
      res.send({
        success: true,
        message: 'Your categories list',
        categories: final_arr,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getTopEffects(req, res, query_params: any): Promise<any> {
    try {
      const { from, to } = query_params;
      const findCond = {
        is_deleted: false,
        created_at: (MoreThanOrEqual(new Date(from)), LessThan(new Date(to))),
      };
      const array = [];
      const effects = await this.userRepository.find({
        where: findCond,
        relations: ['effect'],
      });
      effects.map((eff) => {
        if (eff.effect.length)
          eff.effect.map((a) => {
            array.push(a.effect_id);
          });

        return array;
      });
      const get_top_effects = await this.findTopFiveElement(array);
      const effects_array = [];

      for (const effect of get_top_effects) {
        let total_rating = 0;

        //finding efffects
        const eff = await this.effectsRepository.findOne({
          where: { id: effect },
        });

        //calcualtion entries in diary table
        const entries = await this.diaryRepository
          .createQueryBuilder('diary')
          .leftJoin('diary.desired_effects', 'desired_effects')
          .where('desired_effects.effect_id = :id', { id: effect })
          .getCount();

        //calculation product related to efffects

        const product = await this.diaryRepository
          .createQueryBuilder('diary')
          .leftJoin('diary.desired_effects', 'desired_effects')
          .where('desired_effects.effect_id = :id', { id: effect })
          .distinct()
          .getCount();

        //calculation ratings

        const rating = await this.diaryRepository
          .createQueryBuilder('diary')
          .select('diary.average_ratings')
          .leftJoin('diary.desired_effects', 'desired_effects')
          .where('desired_effects.effect_id = :id', { id: effect })
          .getMany();

        rating.map((r) => {
          if (r.average_ratings)
            return (total_rating = total_rating + parseInt(r.average_ratings));
        });

        const average_rating = total_rating / rating.length;

        // calculating average age
        const age_arr = [];
        let total_age = 0;

        const age = await this.userRepository
          .createQueryBuilder('user')
          .select('user.dob')
          .leftJoin('user.effect', 'effect')
          .where('effect.effect_id = :id', { id: effect })
          .getMany();

        //converting into number from dob
        age.map((a) => {
          return age_arr.push(moment(a.dob).fromNow(true));
        });

        age_arr.map((ag) => {
          const get_number = ag.replace('years', '');
          total_age = total_age + parseInt(get_number);
        });
        const average_age = total_age / age_arr.length;
        //categories
        const product_arr = [];
        const category_arr = [];

        const products = await this.diaryRepository
          .createQueryBuilder('diary')
          .select('diary.product_id')
          .leftJoin('diary.desired_effects', 'desired_effects')
          .where('desired_effects.effect_id = :id', { id: effect })
          .getMany();

        products.map((p) => {
          return product_arr.push(p.product_id);
        });
        const top_products = await this.findTopFiveElement(product_arr);

        for (const product of top_products) {
          const category = await this.diaryRepository
            .createQueryBuilder('diary')
            .where({ product_id: product })
            .leftJoin('diary.product', 'product')
            .addSelect(['product.name'])
            .leftJoin('product.product_type', 'product_type')
            .addSelect(['product_type.name'])
            .getOne();

          const count = await this.diaryRepository.count({
            where: { product_id: product },
          });

          const category_name = category.product.product_type
            ? category.product.product_type.name
            : '';

          category_arr.push({ name: category_name, entries: count });
        }
        //---------------------------------
        effects_array.push({
          name: eff.name,
          entries,
          categories: category_arr,
          product: product,
          average_rating,
          average_age,
        });
      }
      res.send({
        success: true,
        message: 'Your effects list',
        effects_array,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getTopSymptoms(req, res, query_params: any): Promise<any> {
    try {
      const { from, to } = query_params;
      let array = [];
      const symptoms = await this.symptomsRepository.find({ select: ['id'] });

      for (const symp of symptoms) {
        const product = await this.diaryRepository
          .createQueryBuilder('diary')
          .leftJoin('diary.pre_symptoms', 'pre_symptoms')
          .where('pre_symptoms.symptom_id = :id', { id: symp })
          .getCount();
        array = [...array, { id: symp.id, count: product }];
      }
      array.sort((a, b) => {
        return b.count - a.count;
      });
      const first_five = array.slice(0, 5);
      const top_symptoms = [];
      first_five.map((symp) => {
        top_symptoms.push(symp.id);
      });

      const symptoms_array = [];

      for (const symptom of top_symptoms) {
        let total_rating = 0;

        //finding efffects
        const symp = await this.symptomsRepository.findOne({
          where: { id: symptom },
        });

        //calcualtion entries in diary table
        const entries = await this.diaryRepository
          .createQueryBuilder('diary')
          .leftJoin('diary.pre_symptoms', 'pre_symptoms')
          .where('pre_symptoms.symptom_id = :id', { id: symptom })
          .getCount();

        //calculation product related to efffects

        const product = await this.diaryRepository
          .createQueryBuilder('diary')
          .leftJoin('diary.pre_symptoms', 'pre_symptoms')
          .where('pre_symptoms.symptom_id = :id', { id: symptom })
          .distinct()
          .getCount();

        //calculation ratings
        const rating = await this.diaryRepository
          .createQueryBuilder('diary')
          .select('diary.average_ratings')
          .leftJoin('diary.pre_symptoms', 'pre_symptoms')
          .where('pre_symptoms.symptom_id = :id', { id: symptom })
          .getMany();

        rating.map((r) => {
          if (r.average_ratings)
            return (total_rating = total_rating + parseInt(r.average_ratings));
        });

        const average_rating = total_rating / rating.length;

        // calculating average age
        const age_arr = [];
        let total_age = 0;

        const age = await this.userRepository
          .createQueryBuilder('user')
          .select('user.dob')
          .leftJoin('user.symptoms', 'symptoms')
          .where('symptoms.symptom_id = :id', { id: symptom })
          .getMany();

        //converting into number from dob
        age.map((a) => {
          return age_arr.push(moment(a.dob).fromNow(true));
        });

        age_arr.map((ag) => {
          const get_number = ag.replace('years', '');
          total_age = total_age + parseInt(get_number);
        });
        const average_age = total_age / age_arr.length;

        //categories
        const product_arr = [];
        const category_arr = [];

        const products = await this.diaryRepository
          .createQueryBuilder('diary')
          .select('diary.product_id')
          .leftJoin('diary.pre_symptoms', 'pre_symptoms')
          .where('pre_symptoms.symptom_id = :id', { id: symptom })
          .getMany();

        products.map((p) => {
          return product_arr.push(p.product_id);
        });
        const top_products = await this.findTopFiveElement(product_arr);

        for (const product of top_products) {
          const category = await this.diaryRepository
            .createQueryBuilder('diary')
            .where({ product_id: product })
            .leftJoin('diary.product', 'product')
            .addSelect(['product.name'])
            .leftJoin('product.product_type', 'product_type')
            .addSelect(['product_type.name'])
            .getOne();
          const count = await this.diaryRepository.count({
            where: { product_id: product },
          });

          const category_name = category.product.product_type
            ? category.product.product_type.name
            : '';

          category_arr.push({ name: category_name, entries: count });
        }
        //-------------------------------------------------------------------

        symptoms_array.push({
          name: symp.name,
          entries,
          categories: category_arr,
          product: product,
          average_rating,
          average_age,
        });
      }
      res.send({
        success: true,
        message: 'Your symtoms list',
        symptoms_array,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getTopHealthConditions(
    req,
    res,
    query_params: any,
  ): Promise<any> {
    try {
      const { from, to } = query_params;

      const findCond = {
        is_deleted: false,
        created_at: (MoreThanOrEqual(new Date(from)), LessThan(new Date(to))),
      };
      const array = [];

      const conditions = await this.userRepository.find({
        where: findCond,
        relations: ['condition'],
      });

      conditions.map((cond) => {
        if (cond.condition.length)
          cond.condition.map((a) => {
            array.push(a.condition_id);
          });

        return array;
      });
      const get_top_conditions = await this.findTopFiveElement(array);
      const conditions_array = [];

      for (const condition of get_top_conditions) {
        let total_rating = 0;

        //finding condition
        const cond = await this.conditionsRepository.findOne({
          where: { id: condition },
        });

        //calcualtion entries in diary table

        const entries = await this.diaryRepository
          .createQueryBuilder('diary')
          .leftJoin('diary.pre_condition', 'pre_condition')
          .where('pre_condition.condition_id = :id', { id: condition })
          .getCount();

        //calculation product related to condition

        const product = await this.diaryRepository
          .createQueryBuilder('diary')
          .leftJoin('diary.pre_condition', 'pre_condition')
          .where('pre_condition.condition_id = :id', { id: condition })
          .distinct()
          .getCount();

        //calculation ratings

        const rating = await this.diaryRepository
          .createQueryBuilder('diary')
          .select('diary.average_ratings')
          .leftJoin('diary.pre_condition', 'pre_condition')
          .where('pre_condition.condition_id = :id', { id: condition })
          .getMany();

        rating.map((r) => {
          if (r.average_ratings)
            return (total_rating = total_rating + parseInt(r.average_ratings));
        });

        const average_rating = total_rating / rating.length;

        // calculating average age
        const age_arr = [];
        let total_age = 0;
        const age = await this.userRepository
          .createQueryBuilder('user')
          .select('user.dob')
          .leftJoin('user.condition', 'condition')
          .where('condition.condition_id = :id', { id: condition })
          .getMany();

        //converting into number from dob
        age.map((a) => {
          return age_arr.push(moment(a.dob).fromNow(true));
        });

        age_arr.map((ag) => {
          const get_number = ag.replace('years', '');
          total_age = total_age + parseInt(get_number);
        });
        const average_age = total_age / age_arr.length;
        //categories
        const product_arr = [];
        const category_arr = [];

        const products = await this.diaryRepository
          .createQueryBuilder('diary')
          .select('diary.product_id')
          .leftJoin('diary.pre_condition', 'pre_condition')
          .where('pre_condition.condition_id = :id', { id: condition })
          .getMany();

        products.map((p) => {
          return product_arr.push(p.product);
        });
        const top_products = await this.findTopFiveElement(product_arr);

        for (const product of top_products) {
          const category = await this.diaryRepository
            .createQueryBuilder('diary')
            .where({ product_id: product })
            .leftJoin('diary.product', 'product')
            .addSelect(['product.name'])
            .leftJoin('product.product_type', 'product_type')
            .addSelect(['product_type.name'])
            .getOne();
          const count = await this.diaryRepository.count({
            where: { product_id: product },
          });

          const category_name = category.product.product_type
            ? category.product.product_type.name
            : '';

          category_arr.push({ name: category_name, entries: count });
        }
        //----------------------------------------------------------
        conditions_array.push({
          name: cond.name,
          entries,
          categories: category_arr,
          product: product,
          average_rating,
          average_age,
        });
      }
      res.send({
        success: true,
        message: 'Your condition list',
        conditions_array,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getProfileFrequency(req, res): Promise<any> {
    try {
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getProfileReason(req, res): Promise<any> {
    try {
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getRatingAndReviewsMain(req, res): Promise<any> {
    try {
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getObjectivesTop5(req, res): Promise<any> {
    try {
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getPartnerEntryDetails(req, res): Promise<any> {
    try {
      const { entryId } = req.params;
      const findCond = {
        is_active: true,
        is_deleted: false,
        id: entryId,
      };

      const totalEntries = await this.diaryRepository.count();

      const entry = await this.diaryRepository
        .createQueryBuilder('diary')
        .where(findCond)
        .leftJoin('diary.user', 'user')
        .addSelect(['user.full_name', 'user.gender', 'user.dob'])
        .leftJoin('user.consumption_reason', 'consumption_reason')
        .addSelect('consumption_reason.name')
        .leftJoin('diary.product', 'product')
        .addSelect(['product.name', 'product.COA_identifier'])
        .leftJoin('product.product_type', 'product_type')
        .addSelect(['product_type.name'])
        .leftJoinAndSelect('diary.user_comments', 'user_comments')
        .getOne();

      const coaData = await this.coaRepository.findOne({
        where: {
          coa_no: entry.product.COA_identifier,
        },
        select: ['batch_id', 'producer_name', 'distributor_name', 'tested_at'],
      });

      const entryObj = {
        userId: entry.user.id ? entry.user.id : '',
        entry_id: entry.id ? entry.id : '',
        userName: entry.user.full_name ? entry.user.full_name : '',
        product: entry.product.name ? entry.product.name : '',
        product_type: entry.product.product_type
          ? entry.product.product_type.name
          : '',
        average_rating: entry.average_ratings ? entry.average_ratings : '',
        createdAt: entry.created_at,
        gender: entry.user.gender ? entry.user.gender : '-',
        dob: entry.user.dob ? entry.user.dob : '-',
        batch_id: coaData ? coaData.batch_id : '-',
        producer_name: coaData ? coaData.producer_name : '-',
        distributor_name: coaData ? coaData.distributor_name : '-',
        tested_at: coaData ? coaData.tested_at : '',
        consumption_reason: entry.user.consumption_reason
          ? entry.user.consumption_reason.name
          : '-',
        totalEntries,
        isLikeDislike: entry.is_favourite,
        reviews: '',
        negatives: '',
        location: '',
        time: '',
        setting: '',
        is_public: entry.is_public,
        comments: entry.comments,
      };

      res.send({
        success: true,
        message: 'Your entry list',
        data: { entryInfo: entryObj },
      });
    } catch (error) {
      console.trace(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getCategories(req, res): Promise<any> {
    try {
      const { categoriesFrom, categoriesTo, categoryId } = req.query;

      const categoriesFromDate = new Date(categoriesFrom);
      const categoriesFromTo = new Date(categoriesTo);

      const findCond = { is_deleted: 0, is_active: 1 };
      const findCondEntries = { is_deleted: false, is_active: true };

      if (!!categoriesFrom && !!categoriesTo) {
        // findCondEntries.created_at = {
        //   $gte: categoriesFrom.toDateString(),
        //   $lt: categoriesTo.toDateString(),
        // };
        findCondEntries['created_at'] =
          (MoreThanOrEqual(new Date(categoriesFrom)),
          LessThan(new Date(categoriesTo)));
      }

      if (!!categoryId) findCond['id'] = categoryId;

      const ProductTypeData = await this.productTypeRepository.find({
        where: findCond,
        select: ['name', 'id'],
      });

      const ProductTypeArray = [];
      for (let i = 0; i < ProductTypeData.length; i++) {
        const productData = await this.productRepository.find({
          where: {
            product_type_id: ProductTypeData[i].id,
          },
          select: ['id', 'name', 'created_at'],
        });

        const productEntries = [];
        for (let x = 0; x < productData.length; x++) {
          findCondEntries['product_id'] = productData[x].id;
          productEntries.push(
            await this.diaryRepository
              .createQueryBuilder('diary')
              .where(findCondEntries)
              .leftJoin('diary.user', 'user')
              .addSelect([
                'user.full_name',
                'diary.user',
                'diary.id',
                'diary.product',
                'diary.created_at',
                'diary.average_ratings',
              ])
              .getOne(),
          );
        }

        let averageRatings: any;

        const productEntriesMerged = [].concat(...productEntries);
        productEntriesMerged.sort(function (a, b) {
          const aDate: any = new Date(a.created_at);
          const bDate: any = new Date(b.created_at);
          return aDate - bDate;
        });

        let averageRating = 0;
        let b = 0;
        for (let z = 0; z < productEntriesMerged.length; z++) {
          if (!!productEntriesMerged[z].average_ratings) {
            b++;
            averageRating += parseInt(productEntriesMerged[z].average_ratings);
          }
        }

        const countUsers = productEntriesMerged.reduce((groups, item) => {
          const group = groups[item.user] || [];
          group.push(item);
          groups[item.user] = group;
          return groups;
        }, {});

        const resultCategoryData = productEntriesMerged.reduce(
          (r, { created_at }) => {
            const dateObj = new Date(created_at);
            const monthyear = dateObj.toLocaleString('en-us', {
              month: 'long',
              year: 'numeric',
            });
            if (!r[monthyear]) r[monthyear] = { monthyear, entries: 1 };
            else r[monthyear].entries++;
            return r;
          },
          {},
        );

        averageRatings = averageRating / b;
        ProductTypeArray.push({
          product_type_id: ProductTypeData[i].id,
          name: ProductTypeData[i].name,
          total_entries: productEntriesMerged.length,
          average_ratings: averageRatings,
          average_entries:
            productEntriesMerged.length / _.size(resultCategoryData),
          entries: productEntriesMerged,
          entries_by_month: resultCategoryData,
          users: countUsers.length,
          total_users: _.size(countUsers),
          users_entries: countUsers,
        });
      }

      res.send({
        success: true,
        data: ProductTypeArray.sort(
          (a, b) => b.total_entries - a.total_entries,
        ),
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getObjectivesMain(req, res): Promise<any> {
    try {
      const { objectivesFrom, objectivesTo } = req.query;
      const findCondDefault = { is_active: true, is_deleted: false };
      const findCondActivitiesEntries = { is_active: 1, is_deleted: 0 };
      const findCondConditionsEntries = { is_active: 1, is_deleted: 0 };
      const findCondEffectsEntries = { is_active: 1, is_deleted: 0 };
      const findCondSymptomsEntries = { is_active: 1, is_deleted: 0 };

      if (!!objectivesFrom && !!objectivesTo) {
        // findCondActivitiesEntries.created_at = {
        //   $gte: objectivesFrom.toDateString(),
        //   $lt: objectivesTo.toDateString(),
        // };
        // findCondConditionsEntries.created_at = {
        //   $gte: objectivesFrom.toDateString(),
        //   $lt: objectivesTo.toDateString(),
        // };
        // findCondEffectsEntries.created_at = {
        //   $gte: objectivesFrom.toDateString(),
        //   $lt: objectivesTo.toDateString(),
        // };
        // findCondSymptomsEntries.created_at = {
        //   $gte: objectivesFrom.toDateString(),
        //   $lt: objectivesTo.toDateString(),
        // };
        findCondActivitiesEntries['created_at'] =
          (MoreThanOrEqual(new Date(objectivesFrom)),
          LessThan(new Date(objectivesTo)));
        findCondConditionsEntries['created_at'] =
          (MoreThanOrEqual(new Date(objectivesFrom)),
          LessThan(new Date(objectivesTo)));
        findCondEffectsEntries['created_at'] =
          (MoreThanOrEqual(new Date(objectivesFrom)),
          LessThan(new Date(objectivesTo)));
        findCondSymptomsEntries['created_at'] =
          (MoreThanOrEqual(new Date(objectivesFrom)),
          LessThan(new Date(objectivesTo)));
      } else {
        const findCond = { is_deleted: 0, is_active: 1 };
      }

      const activitiesObj = await this.activityRepository.find({
        where: findCondDefault,
        select: ['id', 'name'],
      });
      const conditionsObj = await this.conditionRepository.find({
        where: findCondDefault,
        select: ['id', 'name'],
      });
      const effectsObj = await this.effectsRepository.find({
        where: findCondDefault,
        select: ['id', 'name'],
      });
      const symptomsObj = await this.symptomsRepository.find({
        where: findCondDefault,
        select: ['id', 'name'],
      });

      const objectivesArray = [];
      //Activity
      const objectivesActivityArray = [];
      const objectivesActivityEntries = [];

      for (let i = 0; i < activitiesObj.length; i++) {
        const activitiesEntries = await this.diaryRepository
          .createQueryBuilder('diary')
          .leftJoin('diary.pre_activities', 'pre_activities')
          .leftJoin('diary.user', 'user')
          .where('pre_activities.activity_id= :id', { id: activitiesObj[i].id })
          .andWhere(findCondActivitiesEntries)
          .select([
            'user.full_name',
            'user.gender',
            'user.dob',
            'diary.user',
            'diary.product',
            'diary.created_at',
          ])
          .getMany();

        const activitiesEntriesDateSorted = activitiesEntries.reduce(
          (r, { created_at }) => {
            const dateObj = new Date(created_at);
            const monthyear = dateObj.toLocaleString('en-us', {
              month: 'long',
              year: 'numeric',
            });
            if (!r[monthyear]) r[monthyear] = { monthyear, entries: 1 };
            else r[monthyear].entries++;
            return r;
          },
          {},
        );
        objectivesActivityArray.push({
          name: activitiesObj[i].name,
          total_entries: activitiesEntries.length,
          entries: activitiesEntries,
          entriesByDate: activitiesEntriesDateSorted,
        });
        objectivesActivityEntries.push(activitiesEntries);
      }
      const objectivesActivityEntriesMerged = [].concat(
        ...objectivesActivityEntries,
      );

      const resultActivityData = objectivesActivityEntriesMerged.reduce(
        (r, { created_at }) => {
          const dateObj = new Date(created_at);
          const monthyear = dateObj.toLocaleString('en-us', {
            month: 'long',
            year: 'numeric',
          });
          if (!r[monthyear]) r[monthyear] = { monthyear, entries: 1 };
          else r[monthyear].entries++;
          return r;
        },
        {},
      );

      //Conditions
      const objectivesConditionsArray = [];
      const objectivesConditionsEntries = [];
      for (let i = 0; i < conditionsObj.length; i++) {
        const conditionsEntries = await this.diaryRepository
          .createQueryBuilder('diary')
          .leftJoin('diary.pre_condition', 'pre_condition')
          .leftJoin('diary.user', 'user')
          .where('pre_condition.condition_id= :id', { id: conditionsObj[i].id })
          .andWhere(findCondActivitiesEntries)
          .select([
            'user.full_name',
            'user.gender',
            'user.dob',
            'diary.user',
            'diary.product',
            'diary.created_at',
          ])
          .getMany();

        const conditionsEntriesDateSorted = conditionsEntries.reduce(
          (r, { created_at }) => {
            const dateObj = new Date(created_at);
            const monthyear = dateObj.toLocaleString('en-us', {
              month: 'long',
              year: 'numeric',
            });
            if (!r[monthyear]) r[monthyear] = { monthyear, entries: 1 };
            else r[monthyear].entries++;
            return r;
          },
          {},
        );
        objectivesConditionsArray.push({
          name: conditionsObj[i].name,
          total_entries: conditionsEntries.length,
          entries: conditionsEntries,
          entriesByDate: conditionsEntriesDateSorted,
        });
        objectivesConditionsEntries.push(conditionsEntries);
      }
      const objectivesConditionsEntriesMerged = [].concat(
        ...objectivesConditionsEntries,
      );

      const resultConditionsData = objectivesConditionsEntriesMerged.reduce(
        (r, { created_at }) => {
          const dateObj = new Date(created_at);
          const monthyear = dateObj.toLocaleString('en-us', {
            month: 'long',
            year: 'numeric',
          });
          if (!r[monthyear]) r[monthyear] = { monthyear, entries: 1 };
          else r[monthyear].entries++;
          return r;
        },
        {},
      );

      //Effects
      const objectivesEffectsArray = [];
      const objectivesEffectsEntries = [];
      for (let i = 0; i < effectsObj.length; i++) {
        const EffectsEntries = await this.diaryRepository
          .createQueryBuilder('diary')
          .leftJoin('diary.desired_effects', 'desired_effects')
          .leftJoin('diary.user', 'user')
          .where('desired_effects.effect_id= :id', { id: conditionsObj[i].id })
          .andWhere(findCondEffectsEntries)
          .select([
            'user.full_name',
            'user.gender',
            'user.dob',
            'diary.user',
            'diary.product',
            'diary.created_at',
          ])
          .getMany();

        const EffectsEntriesDateSorted = EffectsEntries.reduce(
          (r, { created_at }) => {
            const dateObj = new Date(created_at);
            const monthyear = dateObj.toLocaleString('en-us', {
              month: 'long',
              year: 'numeric',
            });
            if (!r[monthyear]) r[monthyear] = { monthyear, entries: 1 };
            else r[monthyear].entries++;
            return r;
          },
          {},
        );
        objectivesEffectsArray.push({
          name: effectsObj[i].name,
          total_entries: EffectsEntries.length,
          entries: EffectsEntries,
          entriesByDate: EffectsEntriesDateSorted,
        });
        objectivesEffectsEntries.push(EffectsEntries);
      }
      const objectivesEffectsEntriesMerged = [].concat(
        ...objectivesEffectsEntries,
      );

      const resultEffectsData = objectivesEffectsEntriesMerged.reduce(
        (r, { created_at }) => {
          const dateObj = new Date(created_at);
          const monthyear = dateObj.toLocaleString('en-us', {
            month: 'long',
            year: 'numeric',
          });
          if (!r[monthyear]) r[monthyear] = { monthyear, entries: 1 };
          else r[monthyear].entries++;
          return r;
        },
        {},
      );

      //Symptoms
      const objectivesSymptomsArray = [];
      const objectivesSymptomsEntries = [];
      for (let i = 0; i < symptomsObj.length; i++) {
        const symptomsEntries = await this.diaryRepository
          .createQueryBuilder('diary')
          .leftJoin('diary.pre_symptoms', 'pre_symptoms')
          .leftJoin('diary.user', 'user')
          .where('pre_symptoms.symptom_id= :id', { id: conditionsObj[i].id })
          .andWhere(findCondSymptomsEntries)
          .select([
            'user.full_name',
            'user.gender',
            'user.dob',
            'diary.user',
            'diary.product',
            'diary.created_at',
          ])
          .getMany();

        const symptomsEntriesDateSorted = symptomsEntries.reduce(
          (r, { created_at }) => {
            const dateObj = new Date(created_at);
            const monthyear = dateObj.toLocaleString('en-us', {
              month: 'long',
              year: 'numeric',
            });
            if (!r[monthyear]) r[monthyear] = { monthyear, entries: 1 };
            else r[monthyear].entries++;
            return r;
          },
          {},
        );
        objectivesSymptomsArray.push({
          name: symptomsObj[i].name,
          total_entries: symptomsEntries.length,
          entries: symptomsEntries,
          entriesByDate: symptomsEntriesDateSorted,
        });
        objectivesSymptomsEntries.push(symptomsEntries);
      }
      const objectivesSymptomsEntriesMerged = [].concat(
        ...objectivesSymptomsEntries,
      );

      const resultSymptomsData = objectivesSymptomsEntriesMerged.reduce(
        (r, { created_at }) => {
          const dateObj = new Date(created_at);
          const monthyear = dateObj.toLocaleString('en-us', {
            month: 'long',
            year: 'numeric',
          });
          if (!r[monthyear]) r[monthyear] = { monthyear, entries: 1 };
          else r[monthyear].entries++;
          return r;
        },
        {},
      );

      objectivesArray.push({
        activity: [
          {
            total_objectives: objectivesActivityArray.length,
            objectives: objectivesActivityArray.sort(
              (a, b) => b.total_entries - a.total_entries,
            ),
            merged_entries: Object.values(resultActivityData).sort(
              (a: any, b: any) =>
                new Date(a.monthyear).getTime() -
                new Date(b.monthyear).getTime(),
            ),
          },
        ],
        conditions: [
          {
            total_objectives: objectivesConditionsArray.length,
            objectives: objectivesConditionsArray.sort(
              (a, b) => b.total_entries - a.total_entries,
            ),
            merged_entries: Object.values(resultConditionsData).sort(
              (a: any, b: any) =>
                new Date(a.monthyear).getTime() -
                new Date(b.monthyear).getTime(),
            ),
          },
        ],
        effects: [
          {
            total_objectives: objectivesEffectsArray.length,
            objectives: objectivesEffectsArray.sort(
              (a, b) => b.total_entries - a.total_entries,
            ),
            merged_entries: Object.values(resultEffectsData).sort(
              (a: any, b: any) =>
                new Date(a.monthyear).getTime() -
                new Date(b.monthyear).getTime(),
            ),
          },
        ],
        symptoms: [
          {
            total_objectives: objectivesSymptomsArray.length,
            objectives: objectivesSymptomsArray.sort(
              (a, b) => b.total_entries - a.total_entries,
            ),
            merged_entries: Object.values(resultSymptomsData).sort(
              (a: any, b: any) =>
                new Date(a.monthyear).getTime() -
                new Date(b.monthyear).getTime(),
            ),
          },
        ],
      });
      const activitiesMerged = objectivesArray[0].activity[0].objectives;
      const conditionsMerged = objectivesArray[0].conditions[0].objectives;
      const effectsMerged = objectivesArray[0].effects[0].objectives;
      const symptomsMerged = objectivesArray[0].symptoms[0].objectives;

      const merged_arrays = activitiesMerged.concat(
        conditionsMerged,
        effectsMerged,
        symptomsMerged,
      );

      const merged_arraysSort = merged_arrays.sort(
        (a, b) => b.total_entries - a.total_entries,
      );

      const mergedArrayAces = [];

      for (let i = 0; i < merged_arraysSort.length; i++) {
        const mergedArrayAcesEntries = [];
        for (let e = 0; e < merged_arraysSort[i].entries.length; e++) {
          mergedArrayAcesEntries.push({
            _id: merged_arraysSort[i].entries[e]._id,
            product: merged_arraysSort[i].entries[e].product,
            created_at: merged_arraysSort[i].entries[e].created_at,
            gender: merged_arraysSort[i].entries[e].user.gender,
            user: merged_arraysSort[i].entries[e].user,
          });
        }
        const genderTempResult = {};
        for (const { gender } of mergedArrayAcesEntries) {
          if (gender !== '' && !!gender) {
            genderTempResult[gender] = {
              gender,
              count: genderTempResult[gender]
                ? genderTempResult[gender].count + 1
                : 1,
            };
          }
        }
        const genderResult = Object.values(genderTempResult);
        mergedArrayAces.push({
          name: merged_arraysSort[i].name,
          total_entries: merged_arraysSort[i].total_entries,
          gender: genderResult,
          entries: mergedArrayAcesEntries,
        });
      }
      res.send({
        success: true,
        entriesReason: mergedArrayAces,
        mergedAces: merged_arraysSort,
        data: objectivesArray,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getPartnerProducts(req, res): Promise<any> {
    try {
      const { page, perPageRecord } = req.query;
      const pageNo = page ? page : 0;
      const perPage = perPageRecord ? perPageRecord : 0;
      const pageRecordLimit = parseInt(perPage);
      const skip = (parseInt(pageNo) - 1) * pageRecordLimit;
      const findCond = {
        is_deleted: 0,
        is_active: 1,
      };
      const entriesTotalCount = await this.productRepository.count({
        where: {
          is_deleted: false,
          is_active: 1,
        },
      });
      const products = await this.productRepository
        .createQueryBuilder('data')
        .where(findCond)
        .leftJoin('data.product_type', 'product_type')
        .addSelect(['product_type.name'])
        .take(pageRecordLimit)
        .limit(skip)
        .getMany();

      const pushProducts = [];
      for (const product of products) {
        const findCountCond = {
          pre_activities: Not(IsNull()),
          product_id: product.id,
        };
        const coaData = await this.coaRepository.findOne({
          where: { coa_no: product.COA_identifier },
          select: ['batch_id'],
        });
        const entries = await this.diaryRepository.find({
          where: { product_id: product.id },
          select: ['average_ratings'],
        });
        let x = 0;
        let average_ratings = 0;
        for (const entry of entries) {
          x++;
          average_ratings += parseInt(entry.average_ratings);
        }
        average_ratings = average_ratings / x;
        const totalEntriesCount = await this.diaryRepository.count({
          where: { product_id: product.id },
        });
        const totalObjective = await this.diaryRepository.count({
          where: findCountCond,
        });
        const objProduct = {
          productId: product.id,
          productName: product.name ? product.name : '',
          batchId: coaData ? coaData.batch_id : '-',
          totalObjective: totalObjective,
          totalEntriesCount: totalEntriesCount,
          rating: average_ratings ? average_ratings : 0,
          product_type:
            product && product.product_type ? product.product_type.name : '',
        };
        pushProducts.push(objProduct);
      }
      pushProducts.sort((a, b) => b.totalEntriesCount - a.totalEntriesCount);

      res.send({
        success: true,
        message: 'Your product list',
        data: { products: pushProducts, totalEntries: entriesTotalCount },
      });
    } catch (err) {
      console.log({ err });
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getPartnerProductTypes(req, res): Promise<any> {
    try {
      const findCond = {
        is_deleted: 0,
        name: In([
          'Flower',
          'Edibles',
          'Drinks',
          'Vapes',
          'Shatter / Resin',
          'Tinctures',
          // "Capsule"
        ]),
      };
      const productTypes = await this.productTypeRepository.find({
        where: findCond,
        select: ['name', 'id'],
      });
      res.send({
        success: true,
        message: 'Your product types list',
        data: { productTypes },
      });
    } catch (err) {
      console.log({ err });
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async viewAdvertisement(req, res, advertisementId: any): Promise<any> {
    try {
      const getAdvertisementData = await this.advertisementRepository.findOneBy(
        { id: advertisementId },
      );
      res.send({
        success: true,
        message: 'Success',
        data: getAdvertisementData,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updateAdvertisement(
    req,
    res,
    file,
    data: any,
    advertisementId: any,
  ): Promise<any> {
    try {
      data.placementPageArray = data.placementPageArray.split(',');
      data['placement_page'] = data.placementPageArray;
      delete data.placementPageArray;

      if (file) {
        const advertisementImage = {
          file: file,
          type: 'advertisement_image',
        };
        const response = await this.awsService.s3Upload(advertisementImage);
        const getImagePath = response.Location;
        data['advertisement_image'] = getImagePath;

        await this.advertisementRepository
          .createQueryBuilder()
          .update()
          .set(data)
          .where('id = :id', { id: advertisementId })
          .execute();
          
        res.send({
          success: true,
          message: 'Updated Successfully',
        });
      } else {
        await this.advertisementRepository
          .createQueryBuilder()
          .update()
          .set(data)
          .where('id = :id', { id: advertisementId })
          .execute();
    
        res.send({
          success: true,
          message: 'Updated Successfully',
        });
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findTopElements(arr: any): Promise<any> {
    try {
      let compare = '';
      let mostFreq = '';

      arr.reduce((acc, val) => {
        if (val in acc) {
          // if key already exists
          acc[val]++; // then increment it by 1
        } else {
          acc[val] = 1; // or else create a key with value 1
        }
        if (acc[val] > compare) {
          // if value of that key is greater
          // than the compare value.
          compare = acc[val]; // than make it a new compare value.
          mostFreq = val; // also make that key most frequent.
        }
        return acc;
      }, {});
      return mostFreq;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findTopFiveElement(arr: any): Promise<any> {
    const counts = arr.reduce((act, id) => {
      act[id] = (act[id] || 0) + 1;
      return act;
    }, {});
    // Then create a sorted array from the keys

    const sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    // Then take the first 5

    const top5 = sorted.slice(0, 5);
    return top5;
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
