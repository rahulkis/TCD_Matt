import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../../guards/jwt-auth-guard';
import {
  BlockPublicEntryCmd,
  GetPublicEntiresCmd,
} from '../../../cmd/user.cmd';
import { swaggerTags } from '../../../config/swagger';
import { PublicEntriesService } from './public-entries.service';

@Controller('public-entries')
@ApiTags(swaggerTags.public_entries)
export class PublicEntriesController {
  constructor(private readonly publicEntriesService: PublicEntriesService) {}

  @ApiOperation({
    summary: 'Create block.',
    description: 'Create block.',
    operationId: 'block',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/block')
  @UsePipes(ValidationPipe)
  public async blockUser(
    @Body() body: BlockPublicEntryCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.publicEntriesService.blockUser(req, res, body);
  }

  @ApiOperation({
    summary: 'Get Block.',
    description: 'Get Block.',
    operationId: 'block',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/block')
  public async getPublicEntriesBlocked(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.publicEntriesService.getPublicEntriesBlocked(req, res);
  }

  @ApiOperation({
    summary: 'Get list public entries',
    description: 'Get list public entries',
    operationId: '/',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/')
  public async getPublicEntries(
    @Query() query_params: GetPublicEntiresCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.publicEntriesService.getPublicEntries(
      req,
      res,
      query_params,
    );
  }

  @ApiOperation({
    summary: 'Unblock.',
    description: 'Unblock',
    operationId: 'unblock',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/unblock')
  public async getPublicEntriesUnBlock(
    @Body() body: BlockPublicEntryCmd,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return await this.publicEntriesService.getPublicEntriesUnBlock(
      req,
      res,
      body,
    );
  }
}
