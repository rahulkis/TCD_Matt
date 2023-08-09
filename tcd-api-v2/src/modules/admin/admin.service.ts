import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
  encrypt,
} from '../../helpers/common.helper';
import {
  sendWelcomeEmail,
  twoFactorMail,
  sendContactEmail,
  contactSupportEmail,
  sendFeedbackEmail,
  sendCommunityQuestionMail,
  userAccountDeleteMail,
} from '../../helpers/mail.helper';
import { sendPush } from '../../helpers/notify.helper';
import { sendSMS } from '../../helpers/sms.helper';
import randomstring from 'randomstring';
import moment from 'moment';
import bcrypt from 'bcryptjs';
import { AwsService } from '../../services/aws-service';
import {
  sendAdminForgotPasswordEmail,
  subAdminCreationEmail,
  partnerAdminCreationEmail,
  partnerCreationEmail,
} from '../../helpers/mail.helper';

import { User } from '../../entity/user.entity';
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
import { Partner } from '../../entity/partner.entity';

@Injectable()
export class AdminService {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private readonly awsService: AwsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
    @InjectRepository(CommunityQuestion)
    private readonly communityQuestionRepository: Repository<CommunityQuestion>,
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @InjectRepository(BannerAdvertisement)
    private readonly bannerAdvertisementRepository: Repository<BannerAdvertisement>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(ConsumptionFrequency)
    private readonly consumptionFrequencyRepository: Repository<ConsumptionFrequency>,
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
    @InjectRepository(SettingsMyEntourage)
    private readonly settingsMyEntourageRepository: Repository<SettingsMyEntourage>,
    @InjectRepository(TCDUpdates)
    private readonly tcdUpdatesRepository: Repository<TCDUpdates>,
    @InjectRepository(Physiques)
    private readonly physiquesRepository: Repository<Physiques>,
    @InjectRepository(Effects)
    private readonly effectsRepository: Repository<Effects>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(Cannabinoids)
    private readonly cannabinoidsRepository: Repository<Cannabinoids>,
    @InjectRepository(Strain)
    private readonly strainRepository: Repository<Strain>,
    @InjectRepository(Conditions)
    private readonly conditionsRepository: Repository<Conditions>,
    @InjectRepository(Symptoms)
    private readonly symptomsRepository: Repository<Symptoms>,
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
  ) {}

  public async login(body, req, res): Promise<any> {
    try {
      const { password, email } = body;
      const userInfo = await this.userRepository.findOne({
        where: {
          email: email.trim(),
          is_deleted: false,
        },
      });
      if (!userInfo)
        res.send({
          status: false,
          message: 'Email id does not exist, Please try again.',
        });

      const passwordCheck = await bcrypt.compare(password, userInfo.password);
      if (!passwordCheck) {
        res.send({ status: false, message: 'Incorrect password' });
      } else {
        if (userInfo.is_active == 1) {
          //Send SMS OTP here
          const response = await this.doOTPSend(userInfo.id);
          res.send({
            status: true,
            data: response,
            message: 'OTP sent successfully',
          });
        } else {
          res.send({
            status: false,
            message: 'Your account is blocked.Please contact Super Admin.',
          });
        }
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async verifyOTP(body, req, res): Promise<any> {
    try {
      const { email, otp_code } = body;
      const userInfo = await this.userRepository.findOne({
        where: {
          email: email.trim(),
          is_deleted: false,
        },
      });
      if (
        userInfo.login_otp_code === otp_code &&
        userInfo.login_otp_expiry_on > new Date()
      ) {
        const token = await this.createToken(userInfo);
        const userObj = {
          token,
          userInfo,
        };
        res.send({
          status: true,
          data: userObj,
          message: 'OTP verified successfully',
        });
      } else {
        res.send({
          status: false,
          message: 'Verification Code is invalid.Please try again.',
        });
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async resendOTP(body, req, res): Promise<any> {
    try {
      const { email } = body;

      const userInfo = await this.userRepository.findOne({
        where: { email: email.trim() },
      });
      if (!userInfo) {
        res.send({ success: false, message: "Email doesn't exists" });
      } else {
        const response = await this.doOTPSend(userInfo.id);
        res.send({
          success: true,
          data: response,
          message: 'Verification Code resend successfully',
        });
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async forgotPassword(body, req, res): Promise<any> {
    try {
      const { email } = body;

      const user = await this.userRepository.findOne({
        where: {
          is_deleted: false,
          user_type: 1,
          email: email.trim(),
          is_active: 1,
        },
      });
      if (user) {
        if (user.reset_password_attempted >= 3) {
          res.send({
            success: true,
            message: 'Maximum number of attempt has been exceeded',
          });
        } else {
          const OTP = await randomstring.generate({
            length: 6,
            charset: 'alphanumeric',
            capitalization: 'uppercase',
          });

          const uid = await encrypt(email);
          const salt = await encrypt(OTP);
          const url =
            req.protocol +
            '://' +
            req.get('host') +
            '/admin/reset-password?uid=' +
            uid +
            '&code=' +
            salt;

          const modifiedUserObj = {
            reset_password_otp: OTP,
            reset_password_attempted: user.reset_password_attempted + 1,
            reset_password_attempted_on: new Date(),
          };

          await this.userRepository.update(
            { is_deleted: false, user_type: 1, id: user.id },
            modifiedUserObj,
          );
          const emailData = {
            email: user.email,
            //email:'debabrata.ncrts@gmail.com',
            name: user.full_name,
            url,
          };
          sendAdminForgotPasswordEmail(emailData);

          res.send({
            status: true,
            message: 'Password reset link sent to your email address',
          });
        }
      } else {
        res.send({
          success: true,
          message: 'Email id does not exist, Please try again.',
        });
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async adminDashboard(req, res): Promise<any> {
    try {
      const totalUserRecords = await this.userRepository.count({
        where: { is_deleted: false },
      });
      const totalUserDiaryRecords = await this.diaryRepository.count({
        where: { is_deleted: false },
      });
      const totalCommunityQuestionsRecords =
        await this.communityQuestionRepository.count({
          where: { is_deleted: false },
        });
      const totalVideoRecords = await this.videoRepository.count({
        where: { is_deleted: false },
      });
      const dataObj = {
        totalUserRecords,
        totalUserDiaryRecords,
        totalVideoRecords,
        totalCommunityQuestionsRecords,
      };
      res.send({
        status: true,
        message: 'Dashboard detail fetched successfully',
        data: dataObj,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getUserList(req, res): Promise<any> {
    try {
      const list = await this.userRepository.find();
      res.send({
        status: true,
        message: 'User List',
        data: list,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getSubAdminList(req, res): Promise<any> {
    try {
      const {
        full_name,
        email,
        contact_no,
        filterDateType,
        startDate,
        endDate,
      } = req.query;

      let list = [];
      let findCond = {
        user_type: 3,
        is_deleted: false,
        // created_at: (MoreThanOrEqual(startDate), LessThan(endDate)),
      };

      if (full_name) findCond['full_name'] = Like(`%${full_name}%`);

      if (email) findCond['email'] = Like(`%${email}%`);

      if (contact_no) findCond['contact_no'] = Like(`%${contact_no}%`);

      const subAdminList = await this.userRepository.find({
        where: findCond,
        order: { id: 1 },
      });

      if (subAdminList.length) {
        const profileImgPath =
          'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/profile_image/';

        for (let i = 0; i < subAdminList.length; i++) {
          list.push({
            id: subAdminList[i].id,
            name: subAdminList[i].full_name,
            email: subAdminList[i].email,
            contact_no: subAdminList[i].contact_no,
            profile_image: subAdminList[i].profile_image
              ? profileImgPath + subAdminList[i].profile_image
              : '',
            is_active: subAdminList[i].is_active,
            created_at: moment(subAdminList[i].created_at).format(' DD MMM YY'),
          });
        }
      }
      res.send({
        status: true,
        message: 'Sub Admin List',
        data: list,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async addSubAdmin(req, res, file): Promise<any> {
    try {
      const { full_name, email, contact_no, gender, is_active } = req.body;

      const userCheckEmail = await this.userRepository.find({
        where: {
          email: email.trim(),
          is_deleted: false,
        },
      });

      if (!userCheckEmail.length) {
        const autoPassword = await randomstring.generate({
          length: 8,
          charset: 'alphanumeric',
          capitalization: 'uppercase',
        });

        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(autoPassword, salt);

        let getImagePath;
        if (file) {
          const profileImage = {
            file: file,
            type: 'profile_image',
          };
          const response = await this.awsService.s3Upload(profileImage);
          getImagePath = response.Location;
        }

        let newUser = {
          full_name: full_name,
          email: email,
          contact_no: contact_no,
          gender: gender,
          password: hashPassword,
          user_type: 3,
          is_active: is_active ? 1 : 0,
          profile_image: getImagePath,
        };
        await this.userRepository.save(newUser);

        const emailData = {
          email: email,
          password: autoPassword,
          name: full_name,
        };
        subAdminCreationEmail(emailData);

        res.send({
          success: true,
          message: 'Sub Admin added successfully',
        });
      } else {
        res.send({
          success: false,
          message: 'Email already exists!',
        });
      }
    } catch (error) {
      console.log({ error });
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updateSubAdmin(req, res): Promise<any> {
    try {
      const { id: userId } = req.params;

      const userInfo = await this.userRepository.findOne({
        where: { id: userId },
      });
      res.send({
        success: true,
        message: 'Subadmin Info',
        data: userInfo,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updateSubAdminList(req, res, file): Promise<any> {
    try {
      const { id: userId } = req.params;

      let body = req.body;
      let getImagePath;
      if (file) {
        const profileImage = {
          file: req.file,
          type: 'profile_image',
        };
        const response = await this.awsService.s3Upload(profileImage);
        getImagePath = response.Location;
        body['profile_image'] = getImagePath;
        await this.userRepository.update({ id: userId }, body);
        res.send({
          success: true,
          message: 'Sub Admin Info updated successfully',
        });
      } else {
        await this.userRepository.update({ id: userId }, req.body);
        res.send({
          success: true,
          message: 'Sub Admin Info updated successfully',
        });
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async blockUnblockSubAdmin(req, res): Promise<any> {
    try {
      const { id: userId } = req.params;

      let userInfo = await this.userRepository.findOne({
        where: { id: userId },
      });
      userInfo.is_active = userInfo.is_active == 1 ? 0 : 1;
      const blockOrUnblockUser = await this.userRepository.save(userInfo);
      res.send({
        success: true,
        message: 'Sub Admin status updated successfully',
        data: blockOrUnblockUser,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async deleteSubAdmin(req, res): Promise<any> {
    try {
      const { id: userId } = req.params;

      let userInfo = await this.userRepository.findOne({
        where: { id: userId },
      });
      userInfo.is_deleted = true;
      const deletedSubAdmin = await this.userRepository.save(userInfo);
      res.send({
        success: true,
        message: 'Sub Admin deleted successfully',
        data: deletedSubAdmin,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updateBannerAdvertisement(req, res): Promise<any> {
    try {
      const { id: userId } = req.params;

      const dataInfo = await this.bannerAdvertisementRepository.findBy({
        id: userId,
      });
      res.send({
        success: true,
        message: 'Banner Advertisement Info',
        data: dataInfo,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getUpdateCountryView(req, res): Promise<any> {
    try {
      const { id: countryId } = req.params;

      const countryInfo = await this.countryRepository.findOne({
        where: { id: countryId, is_deleted: false },
      });
      if (!countryInfo) {
        res.send({
          success: true,
          message: 'Country does not exist',
        });
      } else {
        res.send({
          success: true,
          message: 'Country Details',
          data: countryInfo,
        });
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async deleteCountry(req, res): Promise<any> {
    try {
      const { id: countryId } = req.params;

      const countryInfo = await this.countryRepository.findOne({
        where: { is_deleted: false, id: countryId },
      });
      if (!countryInfo) {
        res.send({
          success: true,
          message: 'Country does not exist',
        });
      }

      const countryInUse = await this.userRepository
        .createQueryBuilder('user')
        .leftJoin('user.country', 'country')
        .addSelect('country.id')
        .where('country.id = :id', { id: countryId })
        .getOne();

      if (countryInUse) {
        res.send({
          success: true,
          message: 'Country is in use so you could not remove this record.',
        });
      } else {
        countryInfo.is_deleted = true;
        const deletedCountryInfo = await this.countryRepository.save(
          countryInfo,
        );
        res.send({
          success: true,
          message: 'Country removed successfully.',
          data: deletedCountryInfo,
        });
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getUpdateStateView(req, res): Promise<any> {
    try {
      const { id: stateId } = req.params;

      const countrylist = await this.countryRepository.find({
        where: { is_deleted: false, is_active: true },
      });

      const stateInfo = await this.stateRepository.findOne({
        where: { id: stateId, is_deleted: false },
      });
      if (!stateInfo) {
        res.send({
          success: true,
          message: 'State does not exist',
        });
      } else {
        const countryStateObjDetails = {
          countrylist,
          stateInfo,
        };
        res.send({
          success: true,
          message: 'State Details',
          data: countryStateObjDetails,
        });
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async deleteState(req, res): Promise<any> {
    try {
      const { id: stateId } = req.params;

      const stateInfo = await this.stateRepository.findOne({
        where: { is_deleted: false, id: stateId },
      });
      if (!stateInfo) {
        res.send({
          success: true,
          message: 'State does not exist.',
        });
      }

      const stateInUse = await this.userRepository
        .createQueryBuilder('user')
        .leftJoin('user.state', 'state')
        .addSelect('state.id')
        .where('state.id = :id', { id: stateId })
        .getOne();

      if (stateInUse) {
        res.send({
          success: true,
          message: 'State is in use so you could not remove this record.',
        });
      } else {
        stateInfo.is_deleted = true;
        const deletedStateInfo = await this.countryRepository.save(stateInfo);
        res.send({
          success: true,
          message: 'State removed successfully.',
          data: deletedStateInfo,
        });
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getUpdateConsumptionFrequencyView(req, res): Promise<any> {
    try {
      const { id: frequencyId } = req.params;

      const frequencyInfo = await this.consumptionFrequencyRepository.findOne({
        where: {
          id: frequencyId,
          is_deleted: false,
        },
      });
      if (!frequencyInfo)
        res.send({
          status: true,
          message: 'Consumption frequency does not exist',
        });

      res.send({
        success: true,
        message: 'Consumption Frequency Details',
        data: frequencyInfo,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async deleteConsumptionFrequency(req, res): Promise<any> {
    try {
      const { id } = req.params;

      const consumptionInfo = await this.consumptionFrequencyRepository.findOne(
        {
          where: {
            id,
            is_deleted: false,
          },
        },
      );

      if (!consumptionInfo)
        res.send({
          status: true,
          message: 'Consumption frequency does not exist.',
        });

      const checkInUse = await this.userRepository
        .createQueryBuilder('user')
        .leftJoin('user.cannabis_consumption', 'cannabis_consumption')
        .addSelect('cannabis_consumption.id')
        .where('cannabis_consumption.id = :id', { id })
        .getOne();

      if (checkInUse) {
        res.send({
          success: true,
          message:
            'Consumption frequency is in use so you could not remove this record.',
        });
      } else {
        consumptionInfo.is_deleted = true;
        const deletedConsumptionFrequencyInfo =
          await this.consumptionFrequencyRepository.save(consumptionInfo);
        res.send({
          success: true,
          message: 'Consumption frequency removed successfully.',
          data: deletedConsumptionFrequencyInfo,
        });
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getMyEntourageSettings(req, res): Promise<any> {
    try {
      const myEntourage = await this.settingsMyEntourageRepository.find({
        where: { is_deleted: 0 },
      });
      res.send({
        success: true,
        message: 'Settings My-Entourage Details.',
        data: myEntourage,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updateMyEntourageSettingsForm(req, res): Promise<any> {
    try {
      const { id } = req.query;
      const myEntourage = await this.settingsMyEntourageRepository.findOne({
        where: { is_deleted: 0, id: id },
      });
      res.send({
        success: true,
        message: 'Settings My-Entourage Updated Details.',
        data: myEntourage,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getPartnerUpdates(req, res): Promise<any> {
    try {
      // const updates_list = await TCDUpdates.find().sort({ _id: -1 });
      const updates_list = await this.tcdUpdatesRepository.find({
        order: {
          id: 'DESC',
        },
      });
      res.send({
        success: true,
        message: 'TCD Updates List.',
        data: updates_list,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updatePartnerUpdate(req, res): Promise<any> {
    try {
      const { id: tcdUpdateId } = req.params;

      const tcd_update = await this.tcdUpdatesRepository.findBy({
        id: tcdUpdateId,
      });
      res.send({
        success: true,
        message: 'TCD Update By Id List.',
        data: tcd_update,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async deletePartnerUpdate(req, res): Promise<any> {
    try {
      // const { id } = req.params;
      // await TCDUpdates.findByIdAndRemove(id);
      // req.flash('success_msg', 'Deleted Successfully');
      // res.redirect('/admin/tcd-updates');
      // try {
      //   const { id: tcdUpdateId } = req.params;
      //   const tcd_update = await this.tcdUpdatesRepository.findBy({ id: tcdUpdateId });
      //   res.send({
      //     success: true,
      //     message: 'TCD Update By Id List.',
      //     data: tcd_update,
      //   });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getUserDiaryList(req, res): Promise<any> {
    try {
      const { page_no, full_name, email, is_public } = req.query;
      console.log({ query: req.query });
      let pageNo = page_no ? page_no : 1;

      const findCond = { is_deleted: false };
      if (is_public) findCond['is_public'] = is_public;

      const totalRecords = await this.diaryRepository.count({
        where: findCond,
      });
      const list = [];
      if (totalRecords) {
        const perPageLimit = 20;
        const skip = (parseInt(pageNo) - 1) * perPageLimit;

        const diaryList = await this.diaryRepository
          .createQueryBuilder('diary')
          .where(findCond)
          .leftJoin('diary.user', 'user')
          .addSelect(['user.full_name', 'user.email'])
          .orWhere('user.full_name', { full_name: Like(`%${full_name}%`) })
          .orWhere('user.email', { email: Like(`%${email}%`) })
          .leftJoin('diary.product', 'product')
          .addSelect(['product.name'])
          .leftJoinAndSelect('diary.cannabinoid_profile', 'cannabinoid_profile')
          .leftJoin('cannabinoid_profile.composition', 'composition')
          .addSelect(['composition.name'])
          .leftJoinAndSelect('diary.terpenes', 'terpenes')
          .leftJoin('terpenes.composition', 'terpenses_composition')
          .addSelect(['terpenses_composition.name'])
          .leftJoinAndSelect('diary.pre_symptoms', 'pre_symptoms')
          .leftJoin('pre_symptoms.symptom', 'symptom')
          .addSelect(['symptom.name'])
          .take(perPageLimit)
          .skip(skip)
          .orderBy('diary.created_at', 'ASC')
          .getMany();

        if (diaryList.length) {
          for (let r = 0; r < diaryList.length; r++) {
            let cannabinoid_profile = '';
            if (diaryList[r].cannabinoid_profile.length) {
              for (
                let c = 0;
                c < diaryList[r].cannabinoid_profile.length;
                c++
              ) {
                cannabinoid_profile +=
                  diaryList[r].cannabinoid_profile[c].composition.name +
                  ' - ' +
                  diaryList[r].cannabinoid_profile[c].weight +
                  '%, ';
              }
            }
            let terpenes = '';
            if (diaryList[r].terpenes.length) {
              for (let c = 0; c < diaryList[r].terpenes.length; c++) {
                terpenes +=
                  diaryList[r].terpenes[c].composition.name +
                  ' - ' +
                  diaryList[r].terpenes[c].weight +
                  '%, ';
              }
            }
            let pre_symptoms = '';
            if (diaryList[r].pre_symptoms.length) {
              for (let c = 0; c < diaryList[r].pre_symptoms.length; c++) {
                pre_symptoms +=
                  diaryList[r].pre_symptoms[c].symptom.name + ' , ';
              }
            }

            list.push({
              id: diaryList[r].id,
              user_name: diaryList[r].user ? diaryList[r].user.full_name : '',
              user_email: diaryList[r].user ? diaryList[r].user.email : '',
              product_name: diaryList[r].product
                ? diaryList[r].product.name
                : '',
              day_of_week: diaryList[r].day_of_week,
              is_public: diaryList[r].is_public,
              cannabinoid_profile,
              terpenes,
              pre_symptoms,
              created_at: formatedDate(diaryList[r].created_at, 6),
            });
          }
        }
      }
      res.send({
        status: true,
        message: 'User diary list',
        data: list,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getUserDiaryView(req, res): Promise<any> {
    try {
      const { id: userDiaryId } = req.params;
      const findCond = { id: userDiaryId };
      const userDiaryInfo = await this.diaryRepository
        .createQueryBuilder('diary')
        .where(findCond)
        .leftJoin('diary.user', 'user')
        .addSelect(['user.full_name', 'user.email'])
        .leftJoin('diary.product', 'product')
        .addSelect(['product.name', 'product.description'])
        .leftJoin('product.strain', 'strain')
        .addSelect(['strain.name'])
        .leftJoinAndSelect('diary.cannabinoid_profile', 'cannabinoid_profile')
        .leftJoin('cannabinoid_profile.composition', 'composition')
        .addSelect(['composition.name'])
        .leftJoinAndSelect('diary.terpenes', 'terpenes')
        .leftJoin('terpenes.composition', 'terpenses_composition')
        .addSelect(['terpenses_composition.name'])
        .leftJoinAndSelect('diary.pre_symptoms', 'pre_symptoms')
        .leftJoin('pre_symptoms.symptom', 'symptom')
        .addSelect(['symptom.name'])
        .leftJoinAndSelect('diary.actual_effects', 'actual_effects')
        .leftJoin('actual_effects.effect', 'effect')
        .addSelect(['effect.name'])
        .leftJoinAndSelect('diary.desired_effects', 'desired_effects')
        .leftJoin('desired_effects.effect', 'desired_effect')
        .addSelect(['desired_effect.name'])
        .leftJoinAndSelect('diary.pre_activities', 'pre_activities')
        .leftJoin('pre_activities.activity', 'activity')
        .addSelect(['activity.name'])
        .leftJoinAndSelect(
          'diary.consumption_negative',
          'user_consumption_negative',
        )
        .leftJoin(
          'user_consumption_negative.consumption_negative',
          'consumption_negative',
        )
        .addSelect(['consumption_negative.name'])
        .leftJoin('diary.mood_before_consumption', 'mood')
        .addSelect(['mood.name'])
        .leftJoin('diary.consumption_method', 'consumption_method')
        .addSelect(['consumption_method.name'])
        .getOne();

      const diaryInfo = Object.assign(userDiaryInfo);
      diaryInfo.created_at = formatedDate(diaryInfo.created_at, 6);

      res.send({
        status: true,
        message: 'View User diary list',
        data: diaryInfo,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async blockUnblockUser(req, res, userId: any): Promise<any> {
    try {
      const userInfo = await this.userRepository.findOneBy({ id: userId });
      userInfo.is_active = userInfo.is_active == 1 ? 0 : 1;
      await this.userRepository.save(userInfo);
      res.send({
        success: true,
        message: 'User status has been updated successfully',
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async deleteUser(req, res, userId: any): Promise<any> {
    try {
      const userDetails = await this.userRepository.findOneBy({ id: userId });
      if (!userDetails) {
        res.send({
          success: false,
          message: 'User does not exist',
        });
      }
      if (userDetails.is_deleted) {
        res.send({
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
          'Your TCD account has been deleted by administrator',
          '9',
        );
      }
      const emailData = {
        email: userDetails.email,
        name: userDetails.full_name,
      };
      userAccountDeleteMail(emailData);
      res.send({
        success: true,
        message: 'User account has been deleted succesfully',
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async bulkUserDelete(req, res): Promise<any> {
    try {
      const selectedUsers = req.body.selected_users;
      const deletingUsers = await this.userRepository.find({
        where: { id: In(selectedUsers) },
        select: ['email', 'full_name'],
      });

      await this.userRepository.update(
        { id: In(selectedUsers) },
        { is_deleted: true },
      );
      await this.diaryRepository.update(
        { user_id: In(selectedUsers) },
        { is_deleted: true },
      );
      await this.communityQuestionRepository.update(
        { user: In(selectedUsers) },
        { is_deleted: true },
      );
      if (deletingUsers.length > 0) {
        for (let u = 0; u < deletingUsers.length; u++) {
          const emailData = {
            email: deletingUsers[u].email,
            name: deletingUsers[u].full_name,
          };
          userAccountDeleteMail(emailData);
        }
      }
      res.send({ status: true, message: 'Users removed successfully' });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async editUser(req, res, userId: any): Promise<any> {
    try {
      const profileImgPath =
        'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/profile_image/';
      const physiques = await this.physiquesRepository.find({
        where: { is_deleted: false },
        order: { name: 1 },
      });
      const symptoms = await this.symptomsRepository.find({
        where: { is_deleted: false },
        order: { name: 1 },
      });
      const effects = await this.effectsRepository.find({
        where: { is_deleted: false },
        order: { name: 1 },
      });
      const activities = await this.activityRepository.find({
        where: { is_deleted: false },
        order: { name: 1 },
      });
      const cannabinoids = await this.cannabinoidsRepository.find({
        where: { is_deleted: false },
        order: { name: 1 },
      });
      const strains = await this.strainRepository.find({
        where: { is_deleted: false },
        order: { name: 1 },
      });
      const conditions = await this.conditionsRepository.find({
        where: { is_deleted: false },
        order: { name: 1 },
      });
      const country = await this.countryRepository.find({
        where: { is_deleted: false },
        order: { name: 1 },
      });
      const states = await this.stateRepository.find({
        where: { is_deleted: false },
        order: { name: 1 },
      });
      const cannabis_consumption =
        await this.consumptionFrequencyRepository.find({
          where: { is_deleted: false },
          order: { name: 1 },
        });

      const userInfo = await this.userRepository
        .createQueryBuilder('user')
        .where({ id: userId, is_deleted: false })
        .leftJoin('user.state', 'state')
        .addSelect(['state.name', 'state.id'])
        .leftJoin('state.country', 'country')
        .addSelect(['country.name', 'country.id'])
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

      if (userInfo.state) {
        userDetails['state_name'] = userInfo.state.name;
        userDetails['state'] = userInfo.state.id;
        if (userInfo.state.country) {
          userDetails['country_name'] = userInfo.state.country.name;
          userDetails['country'] = userInfo.state.country.id;
        }
      }
      const data = {};
      data['physiques'] = physiques;
      data['symptoms'] = symptoms;
      data['effects'] = effects;
      data['activities'] = activities;
      data['cannabinoids'] = cannabinoids;
      data['strains'] = strains;
      data['conditions'] = conditions;
      data['country'] = country;
      data['states'] = states;
      data['cannabisConsumption'] = cannabis_consumption;
      const selectedSymptomArr = [];
      for (const index in userInfo.symptoms) {
        selectedSymptomArr.push({
          value: userInfo.symptoms[index].symptom.id,
          label: userInfo.symptoms[index].symptom.name,
        });
      }
      const selectedEffectArr = [];
      for (const index in userInfo.effect) {
        selectedEffectArr.push({
          value: userInfo.effect[index].effect.id,
          label: userInfo.effect[index].effect.name,
        });
      }
      const selectedActivitiesArr = [];
      for (const index in userInfo.activities) {
        selectedActivitiesArr.push({
          value: userInfo.activities[index].activity.id,
          label: userInfo.activities[index].activity.name,
        });
      }
      const selectedCannabinoidsArr = [];
      for (const index in userInfo.cannabinoids) {
        selectedCannabinoidsArr.push({
          value: userInfo.cannabinoids[index].cannabinoids.id,
          label: userInfo.cannabinoids[index].cannabinoids.name,
        });
      }
      const selectedConditionsArr = [];
      for (const index in userInfo.condition) {
        selectedConditionsArr.push({
          value: userInfo.condition[index].conditions.id,
          label: userInfo.condition[index].conditions.name,
        });
      }

      data['details'] = userDetails;
      data['selectedSymptomArr'] = selectedSymptomArr;
      data['selectedEffectArr'] = selectedEffectArr;
      data['selectedActivitiesArr'] = selectedActivitiesArr;
      data['selectedCannabinoidsArr'] = selectedCannabinoidsArr;
      data['selectedConditionsArr'] = selectedConditionsArr;

      data['profileImg'] = userInfo.profile_image
        ? profileImgPath + userInfo.profile_image
        : '';

      res.send({
        data,
        success: true,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getPartnerAdmin(req, res): Promise<any> {
    try {
      const { full_name, email, contact_no } = req.query;

      let findCond = { partner_type: 1, is_deleted: false };

      if (full_name) findCond['full_name'] = Like(`%${full_name}%`);

      if (email) findCond['email'] = Like(`%${email}%`);

      if (contact_no) findCond['contact_no'] = Like(`%${contact_no}%`);

      const partnerAdminList = await this.partnerRepository.find({
        where: findCond,
        order: { id: -1 },
      });
      res.status(HttpStatus.OK).send({
        status: true,
        message: 'Partner Admin List',
        data: partnerAdminList,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async addPartnerAdmin(req, res, file): Promise<any> {
    try {
      const {
        full_name,
        email,
        contact_no,
        gender,
        is_active,
        password,
        confirm_password,
      } = req.body;

      const partnerExist = await this.partnerRepository.find({
        where: {
          email: email.trim(),
          is_deleted: false,
        },
      });
      console.log({ partnerExist });
      if (!partnerExist.length) {
        if (password !== confirm_password) {
          res.status(HttpStatus.PRECONDITION_FAILED).send({
            success: false,
            message: 'Password and Confirm_Password do not match',
          });
          return;
        }
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        let getImagePath;
        if (file) {
          const profileImage = {
            file: file,
            type: 'profile_image',
          };
          const response = await this.awsService.s3Upload(profileImage);
          getImagePath = response.Location;
        }

        let newPartnerAdmin = {
          full_name: full_name,
          email: email,
          contact_no: contact_no,
          gender: gender,
          password: hashPassword,
          partner_type: 1,
          is_active: is_active ? 1 : 0,
          profile_image: getImagePath,
        };
        console.log({ newPartnerAdmin });
        await this.partnerRepository.save(newPartnerAdmin);

        const emailData = {
          email: email,
          password: password,
          name: full_name,
        };
        partnerAdminCreationEmail(emailData);

        res.status(HttpStatus.CREATED).send({
          success: true,
          message: 'Partner Admin added successfully',
        });
      } else {
        res.status(HttpStatus.FOUND).send({
          success: false,
          message: 'Email already exists!',
        });
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updatePartnerAdmin(req, res): Promise<any> {
    try {
      const { id: partnerAdminId } = req.params;

      const partnerAdminInfo = await this.partnerRepository.findOne({
        where: { id: partnerAdminId },
        select: [
          'full_name',
          'email',
          'profile_image',
          'contact_no',
          'gender',
          'is_active',
        ],
      });
      partnerAdminInfo['password'] = '';
      partnerAdminInfo['confirm_password'] = '';
      console.log({ partnerAdminInfo });
      res.status(HttpStatus.OK).send({
        success: true,
        message: 'Partner-Admin Info',
        data: partnerAdminInfo,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updatePartnerAdminList(req, res, file): Promise<any> {
    try {
      const { id: partnerAdminId } = req.params;
      const {
        full_name,
        email,
        contact_no,
        gender,
        is_active,
        password,
        confirm_password,
      } = req.body;

      let updatePartnerAdmin = {
        full_name: full_name,
        email: email,
        contact_no: contact_no,
        gender: gender,
        is_active: is_active ? 1 : 0,
      };

      if (password && password !== confirm_password) {
        return res.status(HttpStatus.PRECONDITION_FAILED).send({
          success: false,
          message: 'Password and Confirm_Password do not match',
        });
      } else if (password && password === confirm_password) {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        updatePartnerAdmin['password'] = hashPassword;
        await this.partnerRepository.update(
          { id: partnerAdminId },
          updatePartnerAdmin,
        );
        res.send({
          success: true,
          message: 'Partner Admin Info Updated Successfully',
        });
      } else {
        let getImagePath;
        if (file) {
          const profileImage = {
            file: req.file,
            type: 'profile_image',
          };
          const response = await this.awsService.s3Upload(profileImage);
          getImagePath = response.Location;
          updatePartnerAdmin['profile_image'] = getImagePath;
          await this.partnerRepository.update(
            { id: partnerAdminId },
            updatePartnerAdmin,
          );
          res.send({
            success: true,
            message: 'Partner Admin Info Updated Successfully',
          });
        } else {
          await this.partnerRepository.update(
            { id: partnerAdminId },
            updatePartnerAdmin,
          );
          res.send({
            success: true,
            message: 'Partner Admin Info Updated Successfully',
          });
        }
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async blockUnblockPartnerAdmin(req, res): Promise<any> {
    try {
      const { id: partnerAdminId } = req.params;

      let partnerAdminInfo = await this.partnerRepository.findOne({
        where: { id: partnerAdminId },
      });
      partnerAdminInfo.is_active = partnerAdminInfo.is_active == 1 ? 0 : 1;
      const blockOrUnblockPartnerAdmin = await this.partnerRepository.save(
        partnerAdminInfo,
      );
      res.send({
        success: true,
        message: 'Partner Admin status updated successfully',
        data: blockOrUnblockPartnerAdmin,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async deletePartnerAdmin(req, res): Promise<any> {
    try {
      const { id: partnerAdminId } = req.params;

      let partnerAdminInfo = await this.partnerRepository.findOne({
        where: { id: partnerAdminId },
      });
      partnerAdminInfo.is_deleted = true;
      partnerAdminInfo.deleted_at = new Date();
      console.log({ partnerAdminInfo });
      const deletedPartnerAdmin = await this.partnerRepository.save(
        partnerAdminInfo,
      );
      res.send({
        success: true,
        message: 'Partner Admin deleted successfully',
        data: deletedPartnerAdmin,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getPartner(req, res): Promise<any> {
    try {
      const { full_name, email, contact_no } = req.query;

      let findCond = { partner_type: 2, is_deleted: false };

      if (full_name) findCond['full_name'] = Like(`%${full_name}%`);

      if (email) findCond['email'] = Like(`%${email}%`);

      if (contact_no) findCond['contact_no'] = Like(`%${contact_no}%`);

      let partnerList = await this.partnerRepository
        .createQueryBuilder('partner')
        .where(findCond)
        .leftJoin('partner.partner_admin', 'partner_admin')
        .addSelect(['partner_admin.full_name'])
        .orderBy('partner.id', 'DESC')
        .getMany();
      res.status(HttpStatus.OK).send({
        status: true,
        message: 'Partner Admin List',
        data: partnerList,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getPartnerAdmins(req, res): Promise<any> {
    try {
      let partnerAdminList = await this.partnerRepository.find({
        where: { partner_type: 1, is_active: 1 },
        select: ['id', 'full_name'],
      });
      res.status(HttpStatus.OK).send({
        status: true,
        message: 'Partner Admin List',
        data: partnerAdminList,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async addPartner(req, res, file): Promise<any> {
    try {
      const {
        full_name,
        email,
        contact_no,
        gender,
        is_active,
        partnerAdmin,
        password,
        confirm_password,
      } = req.body;
      console.log({ body: req.body });

      const userExist = await this.userRepository.find({
        where: { email: email.trim(), is_deleted: false },
      });

      if (userExist.length == 0) {
        const partnerExist = await this.partnerRepository.find({
          where: {
            email: email.trim(),
            is_deleted: false,
          },
        });
        console.log({ partnerExist });
        if (!partnerExist.length) {
          if (password !== confirm_password) {
            res.status(HttpStatus.PRECONDITION_FAILED).send({
              success: false,
              message: 'Password and Confirm_Password do not match',
            });
            return;
          }
          const salt = await bcrypt.genSalt();
          const hashPassword = await bcrypt.hash(password, salt);

          let getImagePath;
          if (file) {
            const profileImage = {
              file: file,
              type: 'profile_image',
            };
            const response = await this.awsService.s3Upload(profileImage);
            getImagePath = response.Location;
          }

          let newPartner = {
            full_name: full_name,
            email: email,
            contact_no: contact_no,
            gender: gender,
            password: hashPassword,
            partner_type: 2,
            partner_admin: partnerAdmin,
            is_active: is_active ? 1 : 0,
            profile_image: getImagePath,
          };
          console.log({ newPartner });
          await this.partnerRepository.save(newPartner);

          const emailData = {
            email: email,
            password: password,
            name: full_name,
          };
          partnerCreationEmail(emailData);

          res.status(HttpStatus.CREATED).send({
            success: true,
            message: 'Partner added successfully',
          });
        } else {
          res.status(HttpStatus.FOUND).send({
            success: false,
            message: 'Email already exists!',
          });
        }
      } else {
        res.status(HttpStatus.FOUND).send({
          success: false,
          message: 'Email already exists!',
        });
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async editPartner(req, res): Promise<any> {
    try {
      const { partnerId } = req.params;
      console.log({ partnerId });
      const partnerInfo = await this.partnerRepository.findOne({
        where: { id: partnerId },
        select: [
          'full_name',
          'email',
          'profile_image',
          'contact_no',
          'gender',
          'partner_admin',
          'is_active',
        ],
      });
      partnerInfo['password'] = '';
      partnerInfo['confirm_password'] = '';
      console.log({ partnerInfo });
      res.status(HttpStatus.OK).send({
        success: true,
        message: 'Partner Info',
        data: partnerInfo,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updatePartnerList(req, res, file): Promise<any> {
    try {
      const { partnerId } = req.params;
      const {
        full_name,
        email,
        contact_no,
        gender,
        is_active,
        password,
        confirm_password,
        partnerAdmin,
      } = req.body;

      let updatePartner = {
        full_name: full_name,
        email: email,
        contact_no: contact_no,
        gender: gender,
        is_active: is_active ? 1 : 0,
      };

      if (password && password !== confirm_password) {
        return res.status(HttpStatus.PRECONDITION_FAILED).send({
          success: false,
          message: 'Password and Confirm_Password do not match',
        });
      } else if (password && password === confirm_password) {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        updatePartner['password'] = hashPassword;
        await this.partnerRepository.update({ id: partnerId }, updatePartner);
        res.send({
          success: true,
          message: 'Partner Info Updated Successfully',
        });
      } else {
        let getImagePath;
        if (file) {
          const profileImage = {
            file: req.file,
            type: 'profile_image',
          };
          const response = await this.awsService.s3Upload(profileImage);
          getImagePath = response.Location;
          updatePartner['profile_image'] = getImagePath;
          await this.partnerRepository.update({ id: partnerId }, updatePartner);
          res.send({
            success: true,
            message: 'Partner Info Updated Successfully',
          });
        } else {
          await this.partnerRepository.update({ id: partnerId }, updatePartner);
          res.send({
            success: true,
            message: 'Partner Info Updated Successfully',
          });
        }
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async blockUnblockPartner(req, res): Promise<any> {
    try {
      const { partnerId } = req.params;

      let partnerInfo = await this.partnerRepository.findOne({
        where: { id: partnerId },
      });
      partnerInfo.is_active = partnerInfo.is_active == 1 ? 0 : 1;
      const blockOrUnblockPartner = await this.partnerRepository.save(
        partnerInfo,
      );
      res.send({
        success: true,
        message: 'Partner status updated successfully',
        data: blockOrUnblockPartner,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async deletePartner(req, res): Promise<any> {
    try {
      const { partnerId } = req.params;

      let partnerInfo = await this.partnerRepository.findOne({
        where: { id: partnerId },
      });
      partnerInfo.is_deleted = true;
      partnerInfo.deleted_at = new Date();
      console.log({ partnerInfo });
      const deletedPartner = await this.partnerRepository.save(
        partnerInfo,
      );
      res.send({
        success: true,
        message: 'Partner deleted successfully',
        data: deletedPartner,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addMinutes(dateObj, minutes): Promise<any> {
    return new Date(dateObj.getTime() + minutes * 60000);
  }

  async regexEscape(string): Promise<any> {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  async doOTPSend(userId): Promise<any> {
    const userInfo = await this.userRepository.findOne({
      where: { id: userId },
    });
    userInfo.login_otp_code = '123456';
    userInfo.login_otp_expiry_on = await this.addMinutes(new Date(), 1); // Valid for one minute only
    const res = await this.userRepository.save(userInfo);
    return res;
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
