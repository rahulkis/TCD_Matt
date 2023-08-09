import {
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { SubAdminService } from './subadmin.service';
import { Response, Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';

@Controller('admin/subadmin')
export class SubAdminController {
  constructor(private readonly subAdminService: SubAdminService) {}

  // TODO
  // @UseGuards(JwtAuthGuard)
  @Get('/list')
  @ApiOperation({
    summary: 'Get subadminlist',
    description: 'get subadminlist',
    operationId: 'subadminlist- pending',
  })
  public async getSubAdminList(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.subAdminService.getSubAdminList(req, res);
  }

  // TODO
  // @UseGuards(JwtAuthGuard)
  @Post('/add')
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
    return await this.subAdminService.addSubAdmin(req, res, file);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/update/:id')
  @ApiOperation({
    summary: 'Subadminlist Update info',
    description: 'subadminlist update info',
    operationId: 'subadminlist/update/:id',
  })
  public async updateSubAdmin(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.subAdminService.updateSubAdmin(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/block-unblock/:id')
  @ApiOperation({
    summary: 'Subadminlist block-unblock',
    description: 'subadminlist block-unblock',
    operationId: 'subadminlist/block-unblock/:id',
  })
  public async blockUnblockSubAdmin(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.subAdminService.blockUnblockSubAdmin(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/delete/:id')
  @ApiOperation({
    summary: 'Subadminlist Delete',
    description: 'subadminlist delete',
    operationId: 'subadminlist/delete/:id',
  })
  public async deleteSubAdmin(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.subAdminService.deleteSubAdmin(req, res);
  }
}
