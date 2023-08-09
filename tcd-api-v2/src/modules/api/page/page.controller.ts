import { Controller, Get, Param, Res } from '@nestjs/common';
import { PageService } from './page.service';
import { Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { swaggerTags } from '../../../config/swagger';

@Controller('page')
@ApiTags(swaggerTags.page)
export class PageController {
  constructor(private readonly pageService: PageService) { }

  @Get('/welcome')
  @ApiOperation({
    summary: 'Welcome text.',
    description: 'Show Welcome text',
    operationId: 'getWelcomePage',
  })
  public async getWelcomePage(@Res() res: Response): Promise<any> {
    return await this.pageService.getWelcomePage(res);
  }

  @Get('/privacy-policy')
  @ApiOperation({
    summary: 'Privacy text.',
    description: 'Show Privacy text',
    operationId: 'getPrivacyPolicyPage',
  })
  public async getPrivacyPolicyPage(@Res() res: Response): Promise<any> {
    return await this.pageService.getPrivacyPolicyPage(res);
  }

  @Get('/about-us')
  @ApiOperation({
    summary: 'Show About Us text.',
    description: 'Show About Us text',
    operationId: 'getAboutUsPage',
  })
  public async getAboutUsPage(@Res() res: Response): Promise<any> {
    return await this.pageService.getAboutUsPage(res);
  }

  @Get('/terms')
  @ApiOperation({
    summary: 'Show terms text.',
    description: 'Show terms text',
    operationId: 'getTermsPage',
  })
  public async getTermsPage(@Res() res: Response): Promise<any> {
    return await this.pageService.getTermsPage(res);
  }

  @Get('/:slug')
  @ApiOperation({
    summary: 'Show page text.',
    description: 'Show pages using slug parameter',
    operationId: 'getSlugPage',
  })
  public async getSlugPage(@Param('slug') slug, @Res() res: Response): Promise<any> {
    return await this.pageService.getSlugPage(slug, res);
  }
}
