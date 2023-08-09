import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, LessThan, Like, MoreThanOrEqual, Repository } from 'typeorm';
import { UserBlocked } from '../../../entity/blocked-user.entity';
import { formatedDate, getExcerpt } from '../../../helpers/common.helper';
import { SearchLogs } from '../../../entity/search-logs.entity';
import { User } from '../../../entity/user.entity';
import { Product } from '../../../entity/product.entity';
import { Diary } from '../../../entity/diary.entity';

@Injectable()
export class PublicEntriesService {
  constructor(
    @InjectRepository(UserBlocked)
    private readonly blockedUserRepository: Repository<UserBlocked>,
    @InjectRepository(SearchLogs)
    private readonly searchLogsRepository: Repository<SearchLogs>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
  ) {}

  public async blockUser(req, res, body: any): Promise<any> {
    try {
      const curUserId = req.user.id;
      const blockedUserid = body.user_id;
      const findCond = {
        is_active: true,
        is_deleted: false,
        blocked_by: curUserId,
        blocked_userid: blockedUserid,
      };
      const userFind = await this.blockedUserRepository.findOne({
        where: findCond,
      });
      if (userFind) {
        res.send({ success: false, message: 'User has already been blocked' });
      } else {
        const newUserBlocked = {
          blocked_userid: blockedUserid,
          blocked_by: curUserId,
        };

        await this.blockedUserRepository.save(newUserBlocked);
        res.send({ success: true, message: 'User has been blocked' });
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getPublicEntriesBlocked(req, res): Promise<any> {
    try {
      const curUserId = req.user.id;
      const findCond = {
        is_deleted: false,
        is_active: true,
        blocked_by: curUserId,
      };
      const profileImgPath =
        'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/profile_image/';
      const userFind = await this.blockedUserRepository
        .createQueryBuilder('blocked_user')
        .where(findCond)
        .leftJoin('blocked_user.user', 'user')
        .addSelect(['user.id', 'user.full_name', 'user.profile_image'])
        .getMany();

      let blocked_users = [];
      for (const blockedUser of userFind) {
        blocked_users.push({
          blocked_userid: blockedUser.user.id,
          user_fullname: blockedUser.user.full_name,
          user_profileimage:
            !!profileImgPath + blockedUser.user.profile_image
              ? profileImgPath + blockedUser.user.profile_image
              : '',
          created_at: blockedUser.created_at,
          is_active: blockedUser.is_active,
          is_deleted: blockedUser.is_deleted,
        });
      }
      const total = userFind.length;
      res.send({
        success: true,
        message: 'Blocked User Lists',
        data: { blocked_users, total },
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //need changes as per diary table
  public async getPublicEntries(req, res, query_params: any): Promise<any> {
    try {
      const userId = req.user.id;
      const {
        search_text,
        is_public,
        user,
        product,
        ratings,
        page,
        search_date_from,
        search_date_to,
      } = query_params;
      const limit = 20;
      let skip = 0;
      let total = 0;
      let totalPages = 0;
      let findCond = {
        is_complete: 1,
        is_deleted: false,
        is_active: true,
        is_public: 1,
      };
      if (search_text) {
        // findCond.$or = [
        //   { keywords: { $regex: search_text, $options: 'i' } },
        // ];
        findCond['keywords'] = Like(`%${search_text}%`);
        const logEntry = {
          search_terms: search_text,
          type: 'getDiaryEntries',
          search_by: userId,
        };
        await this.searchLogsRepository.save(logEntry);
      }
      if (is_public) {
        findCond.is_public = Number(is_public);
      }
      if (user) {
        const userFind = await this.userRepository
          .createQueryBuilder('user')
          .where('user.full_name like :name', { name: `%${user}%` })
          .getMany();

        let userIds = [];
        userFind.forEach((u) => {
          userIds.push(u.id);
        });
        findCond['user_id'] = In(userIds);
      }
      if (product) {
        const productFind = await this.productRepository
          .createQueryBuilder('product')
          .where('product.name like :name', { name: `%${product}%` })
          .getMany();
        let productIds = [];
        productFind.forEach((p) => {
          productIds.push(p.id);
        });
        findCond['product_id'] = In(productIds);
      }
      if (ratings) {
        findCond['average_ratings'] = ratings;
      }
      if (search_date_from && search_date_to) {
        let start = new Date(search_date_from);
        start.setHours(0, 0, 0, 0);

        let end = new Date(search_date_to);
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
      const findBlockedCond = {
        is_active: true,
        is_deleted: false,
        blocked_by: userId,
      };
      const userFind = await this.blockedUserRepository.find({
        where: findBlockedCond,
        select: ['blocked_userid'],
      });

      totalPages = Math.ceil(total / limit);
      let entryList = await this.diaryRepository
        .createQueryBuilder('diary')
        .where(findCond)
        .leftJoin('diary.user', 'user')
        .addSelect(['user.id', 'user.full_name'])
        .leftJoin('diary.product', 'product')
        .addSelect(['prodcut.name', 'product.description'])
        .leftJoin('product.strain', 'strain')
        .addSelect(['strain.name'])
        .limit(limit)
        .skip(skip)
        .orderBy('diary.created_at', 'ASC')
        .getMany();

      let entries = [];
      if (entryList.length > 0) {
        for (const entry of entryList) {
          let continuenext = false;
          let isMyEntryFlag = 2;
          if (entry.user.id === userId) {
            isMyEntryFlag = 1;
          }
          for (const user of userFind) {
            let blockedUserId = user.blocked_userid;
            let useridCheck = entry.user.id;
            if (blockedUserId === useridCheck) {
              continuenext = true;
            }
          }
          if (continuenext) continue;
          entries.push({
            id: entry.id,
            user_name: entry.user ? entry.user.full_name : '',
            user_id: entry.user ? entry.user.id : '',
            name: entry.product ? entry.product.name : '',
            description: entry.product
              ? getExcerpt(entry.product.description, 20)
              : '',
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
            is_my_entry: isMyEntryFlag,
          });
        }
      }

      res.send({
        success: true,
        message: 'Public entries',
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

  public async getPublicEntriesUnBlock(req, res, body: any): Promise<any> {
    try {
      const curUserId = req.user.id;
      const blockedUserid = req.body.user_id;
      const findCond = {
        is_deleted: false,
        is_active: true,
        blocked_by: curUserId,
        blocked_userid: blockedUserid,
      };
      const unblockUser = await this.blockedUserRepository.update(findCond, {
        is_deleted: true,
      });
      if (unblockUser) {
        res.send({ success: true, message: 'User has been unblocked.' });
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
