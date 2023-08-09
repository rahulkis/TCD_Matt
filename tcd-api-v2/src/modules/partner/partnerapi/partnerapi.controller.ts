import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Res,
  Param,
  Query,
  UseGuards,
  Req,
  Get,
  UseInterceptors,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { PartnerapiService } from './partnerapi.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { swaggerTags } from '../../../config/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import {
  PartnerSignupCmd,
  PartnerUpdateSettingCmd,
  ProductsFilterCmd,
  TopEffectsCmd,
  TopProductsCmd,
} from '../../../cmd/partner-signup.cmd';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('')
@ApiTags(swaggerTags.partner)
export class PartnerapiController {
  constructor(private readonly partnerapiService: PartnerapiService) {}

  @Post('/partner-support')
  @ApiOperation({
    summary: 'Partner Support.',
    description: 'Send a support questions',
    operationId: 'create',
  })
  @UsePipes(ValidationPipe)
  async partnerSupport(@Body() body: any, @Res() res: Response): Promise<any> {
    const response = await this.partnerapiService.partnerSupport(body, res);
    return response;
  }

  @Get('/home-data/:userId')
  @ApiOperation({
    summary: 'Home Data.',
    description: 'Get Home Data',
    operationId: 'get',
  })
  @UsePipes(ValidationPipe)
  async homeData(
    @Param('userId') userId: any,
    @Res() res: Response,
  ): Promise<any> {
    const response = await this.partnerapiService.homeData(userId, res);
    return response;
  }

  @Get('/get-profiles-purpose')
  @ApiOperation({
    summary: 'Profiles Purpose.',
    description: 'Get Profiles Purpose',
    operationId: 'get-profiles-purpose',
  })
  @UsePipes(ValidationPipe)
  async getProfilesPurpose(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    const response = await this.partnerapiService.profilePurpose(req, res);
    return response;
  }

  //@UseGuards(JwtAuthGuard)
  @Get('/get-entries-info/:entryId/:userId')
  @ApiOperation({
    summary: 'Get Entries Info',
    description: 'Entries Info',
    operationId: 'get-entries-info/:entryId/:userId',
  })
  public async getPartnerEntriesInfo(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.getPartnerEntriesInfo(req, res);
  }

  @ApiOperation({
    summary: 'Login for partner.',
    description: 'Login for partner.',
    operationId: 'partner-login',
  })
  @Post('/partner-login')
  @UsePipes(ValidationPipe)
  async partnerLogin(@Body() body: any, @Res() res: Response): Promise<any> {
    const partner = await this.partnerapiService.partnerLogin(body, res);
    return partner;
  }

  @ApiOperation({
    summary: 'Forgot password for partner.',
    description: 'Forgot password for partner.',
    operationId: 'partner-forgot-password',
  })
  @Post('/partner-forgot-password')
  @UsePipes(ValidationPipe)
  async partnerForgotPassword(
    @Body() body: any,
    @Res() res: Response,
  ): Promise<any> {
    const response = await this.partnerapiService.partnerForgotPassword(
      body,
      res,
    );
    return response;
  }

  @ApiOperation({
    summary: 'Reset password for partner.',
    description: 'Reset password for partner.',
    operationId: 'partner-reset-password',
  })
  @Post('/partner-reset-password')
  @UsePipes(ValidationPipe)
  async partnerResetPassword(
    @Body() body: any,
    @Res() res: Response,
  ): Promise<any> {
    const response = await this.partnerapiService.partnerResetPassword(
      body,
      res,
    );
    return response;
  }

  @ApiOperation({
    summary: 'Create a partner.',
    description: 'Create a partner.',
    operationId: 'partner-signup',
  })
  @Post('/partner-signup')
  @UsePipes(ValidationPipe)
  async partnerSignUp(
    @Body() body: PartnerSignupCmd,
    @Res() res: Response,
  ): Promise<any> {
    const partner = await this.partnerapiService.partnerSignUp(body, res);
    return partner;
  }

  @ApiOperation({
    summary: 'Create token when logout.',
    description: 'Create token when logout.',
    operationId: 'partner-logout/:token',
  })
  @Post('/partner-logout/:token')
  @UsePipes(ValidationPipe)
  async partnerLogout(
    @Param('token') token: string,
    @Res() res: Response,
  ): Promise<any> {
    const partner = await this.partnerapiService.partnerLogout(token, res);
    return partner;
  }

  //@UseGuards(JwtAuthGuard)
  @Get('/get-profiles-demographics')
  @ApiOperation({
    summary: 'Get Profile Demographics',
    description: 'Profile Demographics',
    operationId: 'get-profiles-demographics',
  })
  public async getProfileDemographics(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.getProfileDemographics(req, res);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('/get-entries-filter')
  @ApiOperation({
    summary: 'Get Entries Filter',
    description: 'Entries Filter',
    operationId: 'get-entries-filter',
  })
  public async getEntriesFilter(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.getEntriesFilter(req, res);
  }

  //@UseGuards(JwtAuthGuard)
  @Post('/delete-user')
  @ApiOperation({
    summary: 'Delete User',
    description: 'Delete User',
    operationId: 'delete-user',
  })
  public async partnerDeleteUser(
    @Query() id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.partnerDeleteUser(req, res, id);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('/edit-user')
  @ApiOperation({
    summary: 'Edit User',
    description: 'Edit User',
    operationId: 'edit-user',
  })
  public async partnerGetEditUser(
    @Query() id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.partnerGetEditUser(req, res, id);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('/get-entries')
  @ApiOperation({
    summary: 'Get Entries',
    description: 'Entries',
    operationId: 'get-entries',
  })
  public async getPartnerEntries(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.getPartnerEntries(req, res);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('/get-user-list')
  @ApiOperation({
    summary: 'Get User List',
    description: 'User List',
    operationId: 'get-user-list',
  })
  public async partnerGetUser(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.partnerGetUser(req, res);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('/get-objectives-entries')
  @ApiOperation({
    summary: 'Get Objectives Entries',
    description: 'Objective Entries',
    operationId: 'get-objectives-entries',
  })
  public async getObjectivesEntries(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.getObjectivesEntries(req, res);
  }

  @Get('/get-objectives-reason')
  @ApiOperation({
    summary: 'Get Objectives Reason',
    description: 'Objective Reason',
    operationId: 'get-objectives-reason',
  })
  public async getObjectivesReason(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.getObjectivesReason(req, res);
  }

  @Get('/get-ratingandreviews-comments')
  @ApiOperation({
    summary: 'Get Rating and Reviews Comments',
    description: 'Rating and Reviews Comments',
    operationId: 'get-ratingandreviews-comments',
  })
  public async getRatingAndReviewsComments(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.getRatingAndReviewsComments(req, res);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('/get-advertisement-info')
  @ApiOperation({
    summary: 'Get Advertisement Info',
    description: 'Advertisement Info',
    operationId: 'get-advertisement-info',
  })
  public async getAdvertisementInfo(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.getAdvertisementInfo(req, res);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('/get-top-brands')
  @ApiOperation({
    summary: 'Get Top Brands',
    description: 'Top Brands',
    operationId: 'get-top-brands',
  })
  public async getTopBrands(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.getTopBrands(req, res);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('/get-consumers')
  @ApiOperation({
    summary: 'Get Consumers',
    description: 'Consumers',
    operationId: 'get-consumers',
  })
  public async getConsumer(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.getConsumer(req, res);
  }

  //@UseGuards(JwtAuthGuard)
  @Post('publish-ads')
  @UseInterceptors(FileInterceptor('advertisement_image'))
  @ApiOperation({
    summary: 'Publish Ads',
    description: 'Publish Ads',
    operationId: 'publish-ads',
  })
  public async publishAds(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.publishAds(req, res, file);
  }

  //@UseGuards(JwtAuthGuard)
  @Put('update-campaign')
  @ApiOperation({
    summary: 'Update Campaign',
    description: 'Update Campaign',
    operationId: 'update-campaign',
  })
  public async updateCampaign(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.updateCampaign(req, res);
  }

  @Get('get-setting-detail')
  @ApiOperation({
    summary: 'Get Setting Detail',
    description: 'Setting Detail',
    operationId: 'get-setting-detail',
  })
  public async partnerGetSetting(
    @Query('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.partnerGetSetting(req, res, id);
  }

  @Post('update-setting-detail')
  @ApiOperation({
    summary: 'Update Setting Detail',
    description: 'Setting Detail',
    operationId: 'update-setting-detail',
  })
  public async partnerUpdateSetting(
    @Query('id') id: string,
    @Body() body: PartnerUpdateSettingCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.partnerUpdateSetting(
      req,
      res,
      body,
      id,
    );
  }

  @Post('add-user')
  @ApiOperation({
    summary: 'Add User',
    description: 'Add User',
    operationId: 'add-user',
  })
  public async partnerAddUser(
    @Body() body: PartnerSignupCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.partnerAddUser(req, res, body);
  }

  @Post('update-user')
  @ApiOperation({
    summary: 'Update User',
    description: 'Update User',
    operationId: 'update-user',
  })
  public async partnerUpdateUser(
    @Query('id') id: string,
    @Body() body: PartnerSignupCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.partnerUpdateUser(req, res, body, id);
  }

  //@UseGuards(JwtAuthGuard)
  @Post('start-campaign')
  @ApiOperation({
    summary: 'Start Campaign',
    description: 'Start Campaign',
    operationId: 'start-campaign',
  })
  public async startCampaign(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.startCampaign(req, res);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('get-campaigns')
  @ApiOperation({
    summary: 'Get Campaign',
    description: 'Get Campaign',
    operationId: 'get-campaigns',
  })
  public async getCampaigns(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.getCampaigns(req, res);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('view-campaign/:campaignId')
  @ApiOperation({
    summary: 'View Campaign',
    description: 'View Campaign',
    operationId: 'view-campaigns',
  })
  public async viewCampaign(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.viewCampaign(req, res);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('tcd-updates')
  @ApiOperation({
    summary: 'Get TCD Updates',
    description: 'TCD Updates',
    operationId: 'tcd-updates',
  })
  public async getPublishedUpdates(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.getPublishedUpdates(req, res);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('tcd-updates/:id')
  @ApiOperation({
    summary: 'Get TCD Updates',
    description: 'TCD Updates',
    operationId: 'tcd-updates',
  })
  public async getPublishedUpdatesById(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.getPublishedUpdatesById(req, res, id);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('get-top-products')
  @ApiOperation({
    summary: 'Get Top Products',
    description: 'Top Products',
    operationId: 'get-top-products',
  })
  public async getTopProducts(
    @Query() query_params: TopProductsCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.getTopProducts(req, res, query_params);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('get-top-activities')
  @ApiOperation({
    summary: 'Get Top Activities',
    description: 'Top Activities',
    operationId: 'get-top-activities',
  })
  public async getTopActivities(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.getTopActivities(req, res);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('get-products-info')
  @ApiOperation({
    summary: 'Get  Products Info',
    description: ' Products Info',
    operationId: 'get-products-info',
  })
  public async getPartnerProductsInfo(
    @Query('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.getPartnerProductsInfo(req, res, id);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('get-product-filter')
  @ApiOperation({
    summary: 'Get Products Filter',
    description: 'Products Filter',
    operationId: 'get-product-filter',
  })
  public async getPartnerProductFilter(
    @Query() query_params: ProductsFilterCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.getPartnerProductFilter(
      req,
      res,
      query_params,
    );
  }

  //@UseGuards(JwtAuthGuard)
  @Get('get-top-categories')
  @ApiOperation({
    summary: 'Get Top Categories',
    description: 'Top Categories',
    operationId: 'get-top-categories',
  })
  public async getTopCategories(
    @Query() query_params: TopEffectsCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.getTopCategories(
      req,
      res,
      query_params,
    );
  }

  @Get('get-top-effects')
  @ApiOperation({
    summary: 'Get Top Effects',
    description: 'Top Effects',
    operationId: 'get-top-effects',
  })
  public async getTopEffects(
    @Query() query_params: TopEffectsCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.getTopEffects(req, res, query_params);
  }

  @Get('/get-top-symptoms')
  @ApiOperation({
    summary: 'Get Top Symptoms',
    description: 'Top Symptoms',
    operationId: 'get-top-symptoms',
  })
  public async getTopSymptoms(
    @Query() query_params: TopEffectsCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.getTopSymptoms(req, res, query_params);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('get-partner-entry-details/:entryId')
  @ApiOperation({
    summary: 'Get Partner Details',
    description: 'Get Partner Details',
    operationId: 'get-partner-entry-details',
  })
  public async getPartnerDetails(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.getPartnerEntryDetails(req, res);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('get-categories')
  @ApiOperation({
    summary: 'Get Categories',
    description: 'Get Categories',
    operationId: 'get-categories',
  })
  public async getCategories(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.getCategories(req, res);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('get-objectives-main')
  @ApiOperation({
    summary: 'Get Objectives Main',
    description: 'Get Objectives Main',
    operationId: 'get-objectives-main',
  })
  public async getObjectivesMain(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.getObjectivesMain(req, res);
  }

  @Get('/get-top-conditions')
  @ApiOperation({
    summary: 'Get Top Conditions',
    description: 'Top Conditions',
    operationId: 'get-top-conditions',
  })
  public async getTopHealthConditions(
    @Query() query_params: TopEffectsCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.getTopHealthConditions(
      req,
      res,
      query_params,
    );
  }

  //@UseGuards(JwtAuthGuard)
  @Get('/get-products')
  @ApiOperation({
    summary: 'Get Products',
    description: 'Get Products',
    operationId: 'get-products',
  })
  public async getPartnerProducts(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.getPartnerProducts(req, res);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/get-product-types')
  @ApiOperation({
    summary: 'Get Product Types',
    description: 'Get Product Types',
    operationId: 'get-product-types',
  })
  public async getPartnerProductTypes(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.getPartnerProductTypes(req, res);
  }

  @Get('/create-new-ad/:advertisementId')
  @ApiOperation({
    summary: ' View Advertisement',
    description: 'View Advertisement',
    operationId: 'create-new-ad',
  })
  public async viewAdvertisement(
    @Param('advertisementId') advertisementId: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.viewAdvertisement(
      req,
      res,
      advertisementId,
    );
  }

  @Put('update-ads/:advertisementId')
  @UseInterceptors(FileInterceptor('advertisement_image'))
  @ApiOperation({
    summary: 'Update Ads',
    description: 'Update Ads',
    operationId: 'update-ads',
  })
  public async updateAdvertisement(
    @Body() body: any,
    @Param('advertisementId') advertisementId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.partnerapiService.updateAdvertisement(
      req,
      res,
      file,
      body,
      advertisementId,
    );
  }
}
