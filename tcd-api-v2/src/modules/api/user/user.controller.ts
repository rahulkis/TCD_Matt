import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { PartnerSignupCmd } from '../../../cmd/partner-signup.cmd';
import { JwtAuthGuard } from '../../../guards/jwt-auth-guard';
import {
  ActivateAccountCmd,
  AddEntryCommentCmd,
  AddVideoCommentCmd,
  CommunityCommentCmd,
  CommunityQuestionCmd,
  ContactCmd,
  CreateProductCmd,
  FingerPrintLoginCmd,
  GetActivityGraphDataCmd,
  GetAllEntriesCmd,
  GetEffectGraphDataCmd,
  LoginCmd,
  MarkFavouriteCommunityQuestionCmd,
  MarkFavouriteEntryCmd,
  MarkFavouriteVideoCmd,
  MarkPublicEntryCmd,
  ReportPublicEntryCmd,
  ReportQuestionCmd,
  ReportSpamCmd,
  ReviewEntryCmd,
  saveCompleteEntryCmd,
  SignupCmd,
  TwoFACodeCmd,
  UpdateSettingsCmd,
} from '../../../cmd/user.cmd';
import { swaggerTags } from '../../../config/swagger';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
@ApiTags(swaggerTags.user)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  @ApiOperation({
    summary: 'User Signup.',
    description: 'Sign up new user. ',
    operationId: 'signup',
  })
  @UsePipes(ValidationPipe)
  async signup(@Body() body: SignupCmd, @Res() res: Response): Promise<any> {
    // return res.send({})
    return await this.userService.signUp(body, res);
  }

  @Post('/login')
  @ApiOperation({
    summary: 'Login.',
    description: 'Logged in user',
    operationId: 'login',
  })
  @UsePipes(ValidationPipe)
  async login(@Body() body: LoginCmd, @Res() res: Response): Promise<any> {
    return await this.userService.login(body, res);
  }

  @Post('/forgot-password')
  @ApiOperation({
    summary: 'Forgot password.',
    description: 'Forgot password',
    operationId: 'forgotPassword',
  })
  @UsePipes(ValidationPipe)
  async forgotPassword(@Body() body: any, @Res() res: Response): Promise<any> {
    const response = await this.userService.forgotPassword(body, res);
    return response;
  }

  @Post('/reset-password')
  @ApiOperation({
    summary: 'Reset password.',
    description: 'Reset User password',
    operationId: 'resetPassword',
  })
  @UsePipes(ValidationPipe)
  async resetPassword(@Body() body: any, @Res() res: Response): Promise<any> {
    const response = await this.userService.resetPassword(body, res);
    return response;
  }
  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @ApiOperation({
    summary: 'Logout.',
    description: 'Logs out user',
    operationId: 'logout',
  })
  @UsePipes(ValidationPipe)
  async logout(@Req() req: Request, @Res() res: Response): Promise<any> {
    return await this.userService.logOut(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/contact')
  @ApiOperation({
    summary: 'User Contacts.',
    description: 'Add a user contact',
    operationId: 'contactSupport',
  })
  @UsePipes(ValidationPipe)
  async contactSupport(
    @Body() body: ContactCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.contactSupport(req, body, res);
  }

  @Get('/get-statelist')
  @ApiOperation({
    summary: 'State List.',
    description: 'show list of users',
    operationId: 'getStateList',
  })
  @UsePipes(ValidationPipe)
  async getStateList(
    @Query('country_id') country_id: string,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.getStateList(country_id, res);
  }

  @Get('/get-all-states')
  @ApiOperation({
    summary: 'State List.',
    description: 'show list of users',
    operationId: 'getAllStates',
  })
  @UsePipes(ValidationPipe)
  async getAllStates(@Res() res: Response): Promise<any> {
    return await this.userService.getAllStates(res);
  }

  @Get('/articles')
  @ApiOperation({
    summary: 'Articles Lists.',
    description: 'Show all articles',
    operationId: 'getArticlesList',
  })
  async getArticlesList(
    @Query('page') page: number,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.getArticlesList(page, res);
  }

  @Post('/send-feedback')
  @ApiOperation({
    summary: 'Send Feedback.',
    description: 'A user can send feedback for the app',
    operationId: 'sendFeedback',
  })
  @UsePipes(ValidationPipe)
  async sendFeedback(
    @Body() body: any,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<any> {
    const response = await this.userService.sendFeedback(body, res);
    // const response = await this.userService.sendFeedback(body, res, req.user);
    return response;
  }

  @Post('/change-password')
  @ApiOperation({
    summary: 'Change user password.',
    description: 'Change user password',
    operationId: 'changePassword',
  })
  @UsePipes(ValidationPipe)
  async changePassword(
    @Body() body: any,
    @Res() res: Response,
    // @Req() req: Request
  ): Promise<any> {
    const response = await this.userService.changePassword(body, res);
    // const response = await this.userService.changePassword(body, res, req.user);
    return response;
  }

  @Get('/faqs')
  @ApiOperation({
    summary: "FAQ's.",
    description: 'FAQ Text',
    operationId: 'getFAQ',
  })
  // @UsePipes(ValidationPipe)
  async getFAQ(
    @Res() res: Response,
    // @Req() req: Request
  ): Promise<any> {
    return await this.userService.getFAQ(res);
    // const response = await this.userService.changePassword(body, res, req.user);
  }

  @ApiOperation({
    summary: 'Videos Lists.',
    description: 'Get all videos.',
    operationId: 'videos',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/videos')
  @UsePipes(ValidationPipe)
  async getVideos(@Req() req: Request, @Res() res: Response): Promise<any> {
    return await this.userService.getVideos(req, res);
  }

  @ApiOperation({
    summary: 'Video Detail.',
    description: 'Get video information.',
    operationId: 'video-details',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/video-details')
  @UsePipes(ValidationPipe)
  async getVideoDetails(
    @Query('video_id', ParseUUIDPipe) video_id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.getVideoDetails(req, res, video_id);
  }

  @ApiOperation({
    summary: 'Mark video as favorite.',
    description: 'Mark video as favorite.',
    operationId: 'mark-favourite-video',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/mark-favourite-video')
  @UsePipes(ValidationPipe)
  async markFavouriteVideo(
    @Body() body: MarkFavouriteVideoCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.markFavouriteVideo(req, res, body);
  }

  @ApiOperation({
    summary: 'Video Comment.',
    description: 'Add comment to video.',
    operationId: 'add-video-comment',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/add-video-comment')
  @UsePipes(ValidationPipe)
  async addVideoComment(
    @Body() body: AddVideoCommentCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.addVideoComment(req, res, body);
  }

  @ApiOperation({
    summary: 'Intro Videos.',
    description: 'Get video intro.',
    operationId: 'intro-videos',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/intro-videos')
  async getIntroVideos(@Res() res: Response): Promise<any> {
    return await this.userService.getIntroVideos(res);
  }

  @ApiOperation({
    summary: 'Create community question.',
    description: 'Create community question.',
    operationId: 'post-community-question',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/post-community-question')
  @UsePipes(ValidationPipe)
  async postCommunityQuestion(
    @Body() body: CommunityQuestionCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.postCommunityQuestion(req, res, body);
  }

  @ApiOperation({
    summary: 'Favourite community question.',
    description: 'Make favourite community question.',
    operationId: 'mark-favourite-community-question',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/mark-favourite-community-question')
  @UsePipes(ValidationPipe)
  async markFavouriteQuestion(
    @Body() body: MarkFavouriteCommunityQuestionCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.markFavouriteQuestion(req, res, body);
  }

  @ApiOperation({
    summary: 'Public entry.',
    description: 'Mark public entry',
    operationId: 'mark-public-entry',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/mark-public-entry')
  @UsePipes(ValidationPipe)
  async markPublicEntry(
    @Body() body: MarkPublicEntryCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.markPublicEntry(req, res, body);
  }

  @ApiOperation({
    summary: 'Create favourite entry.',
    description: 'Create favourite entry.',
    operationId: 'mark-favourite-entry',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/mark-favourite-entry')
  @UsePipes(ValidationPipe)
  async markFavouriteEntry(
    @Body() body: MarkFavouriteEntryCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.markFavouriteEntry(req, res, body);
  }

  @ApiOperation({
    summary: 'Review Entry.',
    description: 'Create new review entry.',
    operationId: 'review-entry',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/review-entry')
  @UsePipes(ValidationPipe)
  async reviewEntry(
    @Body() body: ReviewEntryCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.reviewEntry(req, res, body);
  }

  @ApiOperation({
    summary: 'Community info.',
    description: 'Get community info.',
    operationId: 'community-info',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/community-info')
  @UsePipes(ValidationPipe)
  async communityInfo(@Req() req: Request, @Res() res: Response): Promise<any> {
    return await this.userService.communityInfo(req, res);
  }

  @ApiOperation({
    summary: 'Product Types.',
    description: 'Get Product Types.',
    operationId: 'product-types',
  })
  @Get('product-types')
  @ApiOperation({
    summary: 'Product Types.',
    description: 'Get Product Types',
    operationId: 'get',
  })
  public async findProductTypesByParentId(
    @Res() res: Response,
    @Query('parent_id') parent_id: number,
  ) {
    return await this.userService.findProductTypesByParentId(res, parent_id);
  }

  @ApiOperation({
    summary: 'Create coa.',
    description: 'Upload one coa.',
    operationId: 'upload-coa',
  })
  @Post('upload-coa')
  @UseInterceptors(FileInterceptor('coa'))
  async uploadCoa(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ): Promise<any> {
    const coaFile = await this.userService.uploadCoa(file, res);
    return coaFile;
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-coa-info')
  @ApiOperation({
    summary: 'Get Coa Information',
    description: 'Show Coa-info Details',
    operationId: 'getCoaInfo',
  })
  public async getCoaInfo(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.getCoaInfo(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile-view')
  @ApiOperation({
    summary: 'Get User Profile View',
    description: 'User Profile View',
    operationId: 'profile-view',
  })
  public async getProfileView(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.getProfileView(req, res);
  }

  @ApiOperation({
    summary: 'Get one content.',
    description: 'Get content by slug.',
    operationId: '/get-content/:slug',
  })
  @Get('/get-content/:slug')
  @UsePipes(ValidationPipe)
  public async getStaticContent(
    @Param('slug') slug: string,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.getStaticContent(res, slug);
  }

  @ApiOperation({
    summary: 'Get settings.',
    description: 'Get settings.',
    operationId: 'get-settings',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/get-settings')
  @UsePipes(ValidationPipe)
  public async getSettingsInfo(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.getSettingsInfo(req, res);
  }

  @ApiOperation({
    summary: 'Update settings.',
    description: 'Update settings.',
    operationId: 'update-settings',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/update-settings')
  @UsePipes(ValidationPipe)
  public async updateNotificationSettings(
    @Body() body: UpdateSettingsCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.updateNotificationSettings(req, res, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile-update')
  @UseInterceptors(FileInterceptor('profile_image'))
  @ApiOperation({
    summary: 'Update user profile',
    description: 'User profile updated',
    operationId: 'profile-update',
  })
  public async updateProfile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.updateProfile(req, res, file);
  }

  @ApiOperation({
    summary: 'Save complete entry.',
    description: 'Save complete entry.',
    operationId: 'save-complete-entry',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/save-complete-entry')
  @UsePipes(ValidationPipe)
  public async saveCompleteEntry(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.saveCompleteEntry(req, res);
  }

  @ApiOperation({
    summary: 'Compositions.',
    description: 'Get compositions.',
    operationId: 'compositions',
  })
  @Get('/compositions')
  @UsePipes(ValidationPipe)
  public async getCompositions(
    @Query('type') type: number,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.getCompositions(res, type);
  }

  @ApiOperation({
    summary: 'Create product.',
    description: 'Create product.',
    operationId: 'create-product',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/create-product')
  @UsePipes(ValidationPipe)
  public async createProduct(
    @Body() body: CreateProductCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.createProduct(req, res, body);
  }

  @ApiOperation({
    summary: 'Get incomplete diary entries.',
    description: 'Get incomplete diary entries.',
    operationId: 'incomplete-diary-entries',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/incomplete-diary-entries')
  @UsePipes(ValidationPipe)
  public async getIncompleteDiaryEntries(
    @Query('start_date') start_date: Date,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.getIncompleteDiaryEntries(
      req,
      res,
      start_date,
    );
  }

  @ApiOperation({
    summary: 'Get Dashboard.',
    description: 'Get Dashboard.',
    operationId: 'dashboard',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/dashboard')
  @UsePipes(ValidationPipe)
  public async dashboard(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.dashboard(req, res);
  }

  @ApiOperation({
    summary: 'Update Entry Notify Flag.',
    description: 'Update Entry Notify Flag.',
    operationId: 'update-entry-notify-flag',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/update-entry-notify-flag')
  @UsePipes(ValidationPipe)
  public async updateEntryFlag(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.updateEntryFlag(req, res);
  }

  @ApiOperation({
    summary: 'Create entry',
    description: 'Create entry.',
    operationId: 'create-entry',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/create-entry')
  @UsePipes(ValidationPipe)
  public async createEntry(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.createEntry(req, res);
  }

  @ApiOperation({
    summary: 'Add Entry Comment.',
    description: 'Add Entry Comment.',
    operationId: 'add-entry-comment',
  })
  @Post('/add-entry-comment')
  @UsePipes(ValidationPipe)
  public async addEntryComment(
    @Body() body: AddEntryCommentCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.addEntryComment(req, res, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-banner-advertisements')
  @ApiOperation({
    summary: 'Get Banner Advertisements',
    description: 'Banner Advertisements',
    operationId: 'get-banner-advertisements',
  })
  public async getBannerAdvertisements(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.getBannerAdvertisements(req, res);
  }

  @Get('get-master-data')
  @ApiOperation({
    summary: 'Get Master Data',
    description: 'Master Data',
    operationId: 'get-master-data',
  })
  public async getMasterData(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.getMasterData(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/diary-entries')
  @ApiOperation({
    summary: 'Get Diary Entries',
    description: 'Diary Entires',
    operationId: 'get-diary-entries',
  })
  public async getDiaryEntries(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.getDiaryEntries(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all-diary-entries')
  @ApiOperation({
    summary: 'Get All Diary Entries',
    description: 'All Diary Entires',
    operationId: 'all-diary-entries',
  })
  public async getAllEntries(
    @Query() query_params: GetAllEntriesCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.getAllEntries(req, res, query_params);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get-entry-details')
  @ApiOperation({
    summary: 'Get Entry Detail',
    description: 'Entry Detail',
    operationId: 'get-entry-details',
  })
  public async getDiaryEntryDetails(
    @Query('entry_id') entry_id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.getDiaryEntryDetails(req, res, entry_id);
  }

  @Get('/home-data/user-comments')
  @ApiOperation({
    summary: 'Home Data / User Comments',
    description: 'Home data / User comments',
    operationId: 'home-data/user-comments',
  })
  public async getHomeUserComment(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.getHomeUserComment(req, res);
  }

  @Get('/home-graph/entries')
  @ApiOperation({
    summary: 'Home Graph / Entries',
    description: 'Home graph / Entries',
    operationId: 'home-graph/entries',
  })
  public async getHomeEntries(
    @Query() query_parms: any,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.getHomeEntries(req, res, query_parms);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-ads/:pageName')
  @ApiOperation({
    summary: 'Get Ads',
    description: 'Get Ads by PageName',
    operationId: 'get-ads/:pageName',
  })
  public async getAds(@Req() req: Request, @Res() res: Response): Promise<any> {
    return await this.userService.getAds(req, res);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('get-profiles-main')
  @ApiOperation({
    summary: 'Get Profiles Main',
    description: 'get profiles main',
    operationId: 'get-profiles-main',
  })
  public async getProfileMain(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.getProfileMain(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-tutorial-flag')
  @ApiOperation({
    summary: 'Update Tutorial Flag',
    description: 'update tutorial flag',
    operationId: 'update-tutorial-flag',
  })
  public async updateTutorialFlag(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.updateTutorialFlag(req, res);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('biometric-login')
  @ApiOperation({
    summary: 'Biometric Login',
    description: 'biometric login',
    operationId: 'biometric-login',
  })
  public async fingerPrintLogin(
    @Body() body: FingerPrintLoginCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.fingerPrintLogin(req, res, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('activate-account')
  @ApiOperation({
    summary: 'Activate Account',
    description: 'activate account',
    operationId: 'activate-account',
  })
  public async activateAccount(
    @Body() body: ActivateAccountCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.activateAccount(req, res, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('deactivate-account')
  @ApiOperation({
    summary: 'Deactivate Account',
    description: 'deactivate account',
    operationId: 'deactivate-account',
  })
  public async deactivateAccount(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.deactivateAccount(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('delete-account')
  @ApiOperation({
    summary: 'Delete Account',
    description: 'delete account',
    operationId: 'delete-account',
  })
  public async deleteAccount(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.deleteAccount(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('report-reason')
  @ApiOperation({
    summary: 'Report Reason',
    description: 'report reason',
    operationId: 'report-reason',
  })
  public async reportReason(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.reportReason(req, res);
  }
  @UseGuards(JwtAuthGuard)
  @Get('favourite-entries')
  @ApiOperation({
    summary: 'Get Favourite Entries',
    description: 'get favourite entries',
    operationId: 'favourite-entries',
  })
  public async getFavouriteEntries(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.getFavouriteEntries(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('report-public-entries')
  @ApiOperation({
    summary: 'Report Public Entries',
    description: 'report public entries',
    operationId: 'report-public-entries',
  })
  @UsePipes(ValidationPipe)
  public async reportPublicEntries(
    @Body() body: ReportPublicEntryCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.reportPublicEntries(req, res, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('report-questions')
  @ApiOperation({
    summary: 'Report Questions',
    description: 'report questions',
    operationId: 'report-questions',
  })
  @UsePipes(ValidationPipe)
  public async reportQuestion(
    @Body() body: ReportQuestionCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.reportQuestion(req, res, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-community-question-comment')
  @ApiOperation({
    summary: 'Add Community Question Comment',
    description: 'add community question comment',
    operationId: 'add-community-question-comment',
  })
  @UsePipes(ValidationPipe)
  public async addCommunityQuestionComment(
    @Body() body: CommunityCommentCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.addCommunityQuestionComment(req, res, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-2FA-code')
  @ApiOperation({
    summary: 'Verify 2FA Code',
    description: 'verify 2FA code',
    operationId: 'verify-2FA-code',
  })
  @UsePipes(ValidationPipe)
  public async verify2FACode(
    @Body() body: TwoFACodeCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.verify2FACode(req, res, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('report-spam')
  @ApiOperation({
    summary: 'Report Spam',
    description: 'report spam',
    operationId: 'report-spam',
  })
  @UsePipes(ValidationPipe)
  public async reportSpam(
    @Body() body: ReportSpamCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.reportSpam(req, res, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('report-video')
  @ApiOperation({
    summary: 'Get Report Video',
    description: 'get report video',
    operationId: 'report-video',
  })
  public async ReportVideo(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.reportVideo(req, res);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('get-consumption-methods')
  @ApiOperation({
    summary: 'Consumption Methods',
    description: 'Get Consumption Methods',
    operationId: 'get-consumption-methods',
  })
  public async getConsumptionMethods(
    @Query('category_id') category_id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.getConsumptionMethods(req, res, category_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-activity-graph-data')
  @ApiOperation({
    summary: 'Activity Graph Data',
    description: 'Get Activity Graph Data',
    operationId: 'get-activity-graph-data',
  })
  public async getActivityGraphData(
    @Query() query_params: GetActivityGraphDataCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.getSymptomsGraphData(req, res, query_params);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-effect-graph-data')
  @ApiOperation({
    summary: 'Effect Graph Data',
    description: 'Get Effect Graph Data',
    operationId: 'get-effect-graph-data',
  })
  public async getEffectGraphData(
    @Query() query_params: GetEffectGraphDataCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.getEffectGraphData(req, res, query_params);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-symptom-graph-data')
  @ApiOperation({
    summary: 'Symptom Graph Data',
    description: 'Get Symptom Graph Data',
    operationId: 'get-symptom-graph-data',
  })
  public async getSymptomsGraphData(
    @Query() query_params: any,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.userService.getSymptomsGraphData(req, res, query_params);
  }

}
