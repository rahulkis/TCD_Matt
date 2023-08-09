import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { User } from 'src/entity/user.entity';
import { Between, Like, MoreThanOrEqual, Repository } from 'typeorm';
import randomstring from 'randomstring';
import bcrypt from 'bcryptjs';
import { subAdminCreationEmail } from '../../../helpers/mail.helper';
import { DateFilterEnum } from 'src/enums/date-filter.enum';

@Injectable()
export class SubAdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

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

      const list = [];
      const findCond = {
        user_type: 3,
        is_deleted: false,
      };
      const now = moment();
      switch (parseInt(filterDateType)) {
        case DateFilterEnum.CUSTOM_RANGE:
          findCond['created_at'] = Between(startDate, endDate);
          break;
        case DateFilterEnum.THIS_MONTH:
          findCond['created_at'] = MoreThanOrEqual(
            now.startOf('month').format('YYYY-MM-DD'),
          );
          break;
        case DateFilterEnum.LAST_30_DAYS:
          findCond['created_at'] = MoreThanOrEqual(
            now.subtract(30, 'day').format('YYYY-MM-DD'),
          );
          break;
        case DateFilterEnum.LAST_MONTH:
          findCond['created_at'] = Between(
            now.subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
            now.subtract(1, 'month').endOf('month').format('YYYY-MM-DD'),
          );
          break;
        case DateFilterEnum.THREE_MONTHS:
          findCond['created_at'] = MoreThanOrEqual(
            now.subtract(3, 'month').startOf('month').format('YYYY-MM-DD'),
          );
          break;
        case DateFilterEnum.SIX_MONTHS:
          findCond['created_at'] = MoreThanOrEqual(
            now.subtract(6, 'month').startOf('month').format('YYYY-MM-DD'),
          );
          break;
        default:
          break;
      }

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
      console.log(full_name, email, contact_no, gender, is_active);
      const userCheckEmail = await this.userRepository.find({
        where: {
          email: email.trim(),
          is_deleted: false,
        },
      });
      console.log(userCheckEmail);
      if (!userCheckEmail.length) {
        const autoPassword = await randomstring.generate({
          length: 8,
          charset: 'alphanumeric',
          capitalization: 'uppercase',
        });

        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(autoPassword, salt);

        const newUser = {
          full_name: full_name,
          email: email,
          contact_no: contact_no,
          gender: gender,
          password: hashPassword,
          user_type: 3,
          is_active: is_active ? 1 : 0,
        };

        // if (file) {
        //   const imagePath = uploadPath + '/profile_image/' + req.file.filename;
        //   const profileImage = {
        //     file: req.file,
        //     type: 'profile_image',
        //   }
        //   const response = await s3Upload(profileImage);
        //   if (response) {
        //     userInfo.profile_image = req.file.filename
        //   }
        //   CommonHelper.unlinkFile(imagePath)
        // }

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
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updateSubAdmin(req, res): Promise<any> {
    try {
      const { id: userId } = req.params;

      const userInfo = await this.userRepository.findBy({ id: userId });
      res.send({
        success: true,
        message: 'Subadmin Info',
        data: userInfo,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async blockUnblockSubAdmin(req, res): Promise<any> {
    try {
      const { id: userId } = req.params;

      const userInfo = await this.userRepository.findOne({
        where: { id: userId },
      });
      userInfo.is_active = userInfo.is_active == 1 ? 0 : 1;
      const blockOrUnblockUser = await this.userRepository.save(userInfo);
      res.send({
        success: true,
        message: 'Subadmin Block or Unblock successfully',
        data: blockOrUnblockUser,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async deleteSubAdmin(req, res): Promise<any> {
    try {
      const { id: userId } = req.params;

      const userInfo = await this.userRepository.findOne({
        where: { id: userId },
      });
      userInfo.is_deleted = true;
      const deletedSubAdmin = await this.userRepository.save(userInfo);
      res.send({
        success: true,
        message: 'Sub Admin status deleted successfully',
        data: deletedSubAdmin,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
