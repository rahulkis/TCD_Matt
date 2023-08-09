import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CmsPages } from '../../../entity/cmspages.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(CmsPages)
    private readonly pageRepository: Repository<CmsPages>,
  ) { }

  public async getWelcomePage(res): Promise<any> {
    try {
      //   const obj = {
      //     page_title: 'Privacy Policy',
      //     meta_title: 'privacy',
      //     meta_description: 'about descritpion',
      //     meta_keywords: 'about keyword',
      //     sort_order: 0,
      //     slug: 'privacy-policy',

      //   };

      //   return await this.pageRepository.save(obj);
      const slug = 'welcome';
      const cmsCond = { slug: slug, is_deleted: false, is_active: true };
      const cmsObj = await this.pageRepository.findOne({ where: cmsCond });
      if (!cmsObj) {
        return res.send({ success: false, message: 'Page does not exist' });
      }
      const page = {
        page_title: cmsObj.page_title,
        page_content: cmsObj.page_content,
      };
      res.send({ success: true, data: { page }, message: '' });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getPrivacyPolicyPage(res): Promise<any> {
    try {
      const slug = 'privacy-policy';
      const cmsCond = { slug: slug, is_deleted: false, is_active: true };
      const cmsObj = await this.pageRepository.findOne({ where: cmsCond });
      if (!cmsObj) {
        return res.send({ success: false, message: 'Page does not exist' });
      }
      const page = {
        page_title: cmsObj.page_title,
        page_content: cmsObj.page_content,
      };
      res.send({ success: true, data: { page }, message: '' });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getAboutUsPage(res): Promise<any> {
    try {
      const slug = 'about-us';
      const cmsCond = { slug: slug, is_deleted: false, is_active: true };
      const cmsObj = await this.pageRepository.findOne({ where: cmsCond });
      if (!cmsObj) {
        return res.send({ success: false, message: 'Page does not exist' });
      }
      const page = {
        page_title: cmsObj.page_title,
        page_content: cmsObj.page_content,
      };
      res.send({ success: true, data: { page }, message: '' });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getTermsPage(res): Promise<any> {
    try {
      const slug = 'terms';
      const cmsCond = { slug: slug, is_deleted: false, is_active: true };
      const cmsObj = await this.pageRepository.findOne({ where: cmsCond });
      if (!cmsObj) {
        return res.send({ success: false, message: 'Page does not exist' });
      }
      const page = {
        page_title: cmsObj.page_title,
        page_content: cmsObj.page_content,
      };
      res.send({ success: true, data: { page }, message: '' });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getSlugPage(slug, res): Promise<any> {
    try {
      const paramSlug = slug;
      if (!slug)
        return res.send({ success: false, message: "Please provide slug" })

      const cmsCond = { slug: paramSlug, is_deleted: false, is_active: true }
      const cmsObj = await this.pageRepository.findOne({ where: cmsCond })
      if (!cmsObj) {
        return res.send({ success: false, message: "Page does not exist" })
      }
      const page = {
        page_title: cmsObj.page_title,
        page_content: cmsObj.page_content
      }
      res.send({ success: true, data: { page }, message: "" })
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
