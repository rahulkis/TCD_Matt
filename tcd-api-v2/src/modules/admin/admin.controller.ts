import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AdminService } from './admin.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { swaggerTags } from '../../config/swagger';
import {
  ForgotPasswordCmd,
  LoginCmd,
  VerifyOTPCmd,
  ResendOTPCmd,
} from '../../cmd/admin.cmd';
import { JwtAuthGuard } from '../../guards/jwt-auth-guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('admin')
@ApiTags(swaggerTags.admin)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/login')
  @ApiOperation({
    summary: 'Admin Login',
    description: 'admin login',
    operationId: 'login',
  })
  @UsePipes(ValidationPipe)
  public async login(
    @Body() body: LoginCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.login(body, req, res);
  }

  @Post('/verify-otp')
  @ApiOperation({
    summary: 'Verify OTP',
    description: 'verify otp',
    operationId: 'verify otp',
  })
  @UsePipes(ValidationPipe)
  public async verifyOTP(
    @Body() body: VerifyOTPCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.verifyOTP(body, req, res);
  }

  @Post('/resend-otp')
  @ApiOperation({
    summary: 'Resend OTP',
    description: 'Resend OTP',
    operationId: 'Resend OTP',
  })
  @UsePipes(ValidationPipe)
  public async resendOTP(
    @Body() body: ResendOTPCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.resendOTP(body, req, res);
  }

  @Post('/forgot-password')
  @ApiOperation({
    summary: 'Forgot Password',
    description: 'Forgot Password',
    operationId: 'Forgot Password',
  })
  @UsePipes(ValidationPipe)
  public async forgotPassword(
    @Body() body: ForgotPasswordCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.forgotPassword(body, req, res);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/dashboard')
  @ApiOperation({
    summary: 'Admin Dashboard',
    description: 'admin dashboard',
    operationId: 'dashboard',
  })
  public async adminDashboard(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.adminDashboard(req, res);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/subadminlist')
  @ApiOperation({
    summary: 'Get subadminlist',
    description: 'get subadminlist',
    operationId: 'subadminlist',
  })
  public async getSubAdminList(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.getSubAdminList(req, res);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/userlist')
  @ApiOperation({
    summary: 'Get user list',
    description: 'get user list',
    operationId: 'user list- pending',
  })
  public async getUserList(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.getUserList(req, res);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('/subadminlist/add')
  @UseInterceptors(FileInterceptor('profile_image'))
  @ApiOperation({
    summary: 'Add New SubAdmin',
    description: 'Add New SubAdmin',
    operationId: '/subadminlist/add',
  })
  public async addSubAdmin(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.addSubAdmin(req, res, file);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/subadminlist/update/:id')
  @ApiOperation({
    summary: 'Subadminlist Update info',
    description: 'subadminlist update info',
    operationId: 'subadminlist/update/:id',
  })
  public async updateSubAdmin(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.updateSubAdmin(req, res);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch('/subadminlist/update/data/:id')
  @UseInterceptors(FileInterceptor('profile_image'))
  @ApiOperation({
    summary: 'Subadminlist Update info',
    description: 'subadminlist update info',
    operationId: 'subadminlist/update/data/:id',
  })
  public async updateSubAdminList(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.updateSubAdminList(req, res, file);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch('/subadminlist/block-unblock/:id')
  @ApiOperation({
    summary: 'Subadminlist block-unblock',
    description: 'subadminlist block-unblock',
    operationId: 'subadminlist/block-unblock/:id',
  })
  public async blockUnblockSubAdmin(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.blockUnblockSubAdmin(req, res);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch('/subadminlist/delete/:id')
  @ApiOperation({
    summary: 'Subadminlist Delete',
    description: 'subadminlist delete',
    operationId: 'subadminlist/delete/:id',
  })
  public async deleteSubAdmin(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.deleteSubAdmin(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/banner-advertisement/update/:id')
  @ApiOperation({
    summary: 'Banner Advertisement Update Info',
    description: 'Banner Advertisement Update Info',
    operationId: '/banner-advertisement/update/:id',
  })
  public async updateBannerAdvertisement(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.updateBannerAdvertisement(req, res);
  }

  //Country api's
  @UseGuards(JwtAuthGuard)
  @Get('/country/update/:id')
  @ApiOperation({
    summary: 'Update Country Info',
    description: 'update country info',
    operationId: 'country/update/:id',
  })
  public async getUpdateCountryView(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.getUpdateCountryView(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/country/delete/:id')
  @ApiOperation({
    summary: 'Delete Country',
    description: 'delete country',
    operationId: 'country/delete/:id',
  })
  public async deleteCountry(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.deleteCountry(req, res);
  }

  //State api's
  @UseGuards(JwtAuthGuard)
  @Get('/states/update/:id')
  @ApiOperation({
    summary: 'Update State Info',
    description: 'update state info',
    operationId: 'states/update/:id',
  })
  public async getUpdateStateView(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.getUpdateStateView(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/states/delete/:id')
  @ApiOperation({
    summary: 'Delete State',
    description: 'delete state',
    operationId: 'states/delete/:id',
  })
  public async deleteState(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.deleteState(req, res);
  }

  //Consumption Frequency api's
  @UseGuards(JwtAuthGuard)
  @Get('/consumption-frequency/update/:id')
  @ApiOperation({
    summary: 'Update Consumption Frequency Info',
    description: 'Update Consumption Frequency Info',
    operationId: '/consumption-frequency/update/:id',
  })
  public async getUpdateConsumptionFrequencyView(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.getUpdateConsumptionFrequencyView(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/consumption-frequency/delete/:id')
  @ApiOperation({
    summary: 'Delete Consumption Frequency Info',
    description: 'Update Consumption Frequency Info',
    operationId: '/consumption-frequency/delete/:id',
  })
  public async deleteConsumptionFrequency(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.deleteConsumptionFrequency(req, res);
  }

  //Consumption Reason
  @UseGuards(JwtAuthGuard)
  @Get('/consumption-reason/update/:id')
  @ApiOperation({
    summary: 'Update Consumption Reason Info',
    description: 'Update Consumption Reason Info',
    operationId: '/consumption-reason/update/:id',
  })
  public async getUpdateConsumptionReasonView(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.getUpdateConsumptionFrequencyView(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/consumption-reason/delete/:id')
  @ApiOperation({
    summary: 'Delete Consumption Reason Info',
    description: 'Update Consumption Reason Info',
    operationId: '/consumption-reason/delete/:id',
  })
  public async deleteConsumptionReason(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.deleteConsumptionFrequency(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/settings/my-entourage')
  @ApiOperation({
    summary: 'Settings My-Entourage Info',
    description: 'Settings My-Entourage Info',
    operationId: 'settings/my-entourage',
  })
  public async getMyEntourageSettings(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.getMyEntourageSettings(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/settings/my-entourage/update')
  @ApiOperation({
    summary: 'Update Settings My-Entourage Info',
    description: 'Update Settings My-Entourage Info',
    operationId: '/settings/my-entourage/update',
  })
  public async updateMyEntourageSettingsForm(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.updateMyEntourageSettingsForm(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/tcd-updates')
  @ApiOperation({
    summary: 'TCD Update',
    description: 'tcd update',
    operationId: '/tcd-updates',
  })
  public async getPartnerUpdates(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.getPartnerUpdates(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/tcd-updates/update/:id')
  @ApiOperation({
    summary: 'TCD-Update Update By Id',
    description: 'tcd-update update by id',
    operationId: '/tcd-updates/update/:id',
  })
  public async updatePartnerUpdate(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.updatePartnerUpdate(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/tcd-updates/delete/:id')
  @ApiOperation({
    summary: 'TCD Update Delete By Id',
    description: 'tcd update delete by id',
    operationId: '/tcd-updates/delete/:id',
  })
  public async deletePartnerUpdate(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.deletePartnerUpdate(req, res);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/userdiarylist')
  @ApiOperation({
    summary: 'Get user diary list',
    description: 'get user diary list',
    operationId: 'userdiarylist',
  })
  public async getUserDiaryList(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.getUserDiaryList(req, res);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/userdiarylist/view/:id')
  @ApiOperation({
    summary: 'View User Diary List By Id ',
    description: 'view user diary list by id',
    operationId: 'userdiarylist/view/:id',
  })
  public async getUserDiaryView(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.getUserDiaryView(req, res);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('userlist/block-unblock/:id')
  @ApiOperation({
    summary: 'Block Unblock User',
    description: 'block unblock user',
    operationId: 'User List',
  })
  public async blockUnblockUser(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.blockUnblockUser(req, res, id);
  }

  @Delete('userlist/delete/:id')
  @ApiOperation({
    summary: 'Delete User',
    description: 'delete user',
    operationId: 'User List',
  })
  public async deleteUser(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.deleteUser(req, res, id);
  }

  @Get('userlist/edit/:id')
  @ApiOperation({
    summary: 'Edit User',
    description: 'edit user',
    operationId: 'User List',
  })
  public async editUser(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.editUser(req, res, id);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/partner-admin')
  @ApiOperation({
    summary: 'Get Partner Admin',
    description: 'get partner admin',
    operationId: 'partner-admin',
  })
  public async getPartnerAdmin(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.getPartnerAdmin(req, res);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('/partner-admin/add')
  @UseInterceptors(FileInterceptor('profile_image'))
  @ApiOperation({
    summary: 'Add New Partner-Admin',
    description: 'add new partner-admin',
    operationId: '/partner-admin/add',
  })
  public async addPartnerAdmin(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.addPartnerAdmin(req, res, file);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/partner-admin/update/:id')
  @ApiOperation({
    summary: 'Partner-Admin Update info',
    description: 'partner-admin update info',
    operationId: 'partner-admin/update/:id',
  })
  public async updatePartnerAdmin(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.updatePartnerAdmin(req, res);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch('/partner-admin/update/data/:id')
  @UseInterceptors(FileInterceptor('profile_image'))
  @ApiOperation({
    summary: 'Partner-Admin Update info',
    description: 'partner-admin update info',
    operationId: 'partner-admin/update/data/:id',
  })
  public async updatePartnerAdminList(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.updatePartnerAdminList(req, res, file);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch('/partner-admin/block-unblock/:id')
  @ApiOperation({
    summary: 'Partner-Admin block-unblock',
    description: 'partner-admin block-unblock',
    operationId: 'partner-admin/block-unblock/:id',
  })
  public async blockUnblockPartnerAdmin(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.blockUnblockPartnerAdmin(req, res);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch('/partner-admin/delete/:id')
  @ApiOperation({
    summary: 'Partner-Admin Delete',
    description: 'partner-admin delete',
    operationId: 'partner-admin/delete/:id',
  })
  public async deletePartnerAdmin(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.deletePartnerAdmin(req, res);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/partner')
  @ApiOperation({
    summary: 'Get Partner',
    description: 'get partner',
    operationId: 'partner',
  })
  public async getPartner(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.getPartner(req, res);
  }

  @Get('/partner/admins')
  @ApiOperation({
    summary: 'Get Partner Admins',
    description: 'get partner admins',
    operationId: 'partner/admins',
  })
  public async getPartnerAdmins(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.getPartnerAdmins(req, res);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('/partner/add')
  @UseInterceptors(FileInterceptor('profile_image'))
  @ApiOperation({
    summary: 'Add New Partner',
    description: 'add new partner',
    operationId: '/partner/add',
  })
  public async addPartner(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.addPartner(req, res, file);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/partner/edit/:partnerId')
  @ApiOperation({
    summary: 'Partner Edit Info',
    description: 'partner edit info',
    operationId: 'partner/edit/:partnerId',
  })
  public async editPartner(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.editPartner(req, res);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch('/partner/update/data/:id')
  @UseInterceptors(FileInterceptor('profile_image'))
  @ApiOperation({
    summary: 'Partner-Admin Update info',
    description: 'partner-admin update info',
    operationId: 'partner-admin/update/data/:id',
  })
  public async updatePartnerList(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.updatePartnerList(req, res, file);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch('/partner/block-unblock/:partnerId')
  @ApiOperation({
    summary: 'Partner block-unblock',
    description: 'partner block-unblock',
    operationId: 'partner/block-unblock/:partnerId',
  })
  public async blockUnblockPartner(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.blockUnblockPartner(req, res);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch('/partner/delete/:partnerId')
  @ApiOperation({
    summary: 'Partner Delete',
    description: 'partner delete',
    operationId: 'partner/delete/:partnerId',
  })
  public async deletePartner(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.adminService.deletePartner(req, res);
  }

}
