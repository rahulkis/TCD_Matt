import { Body, Controller, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { swaggerTags } from 'src/config/swagger';
import { TCDUpdatesCreateDto } from 'src/dto/tcd-update/tcd-update-create.dto';
import { TCDUpdatesUpdateDto } from 'src/dto/tcd-update/tcd-update-update.dto';
import { TCDUpdates } from 'src/entity/tcd-updates.entity';
import { TcdUpdateService } from './tcd-update.service';

@Controller('tcd-update')
@ApiTags(swaggerTags.tcd_update)
export class TCDUpdateController {
  constructor(private readonly tcdUpdateService: TcdUpdateService) {}

  @Get('/get-list')
  @ApiOperation({
    summary: 'TCD Update get list',
    description: 'TCD Update get list',
    operationId: 'TCD Update get list',
  })
  public async getList(): Promise<any> {
    return await this.tcdUpdateService.getList();
  }

  @Get('/get-all-category')
  @ApiOperation({
    summary: 'TCD Update get all category',
    description: 'TCD Update get all category',
    operationId: 'TCD Update get all category',
  })
  public async getAllCategory(): Promise<any> {
    return this.tcdUpdateService.getAllCategory();
  }

  @Post('/create')
  @ApiOperation({
    summary: 'create TCD Update',
    description: 'create TCD Update',
    operationId: 'create TCD Update',
  })
  public async create(@Body() createDto: TCDUpdatesCreateDto): Promise<void> {
    return this.tcdUpdateService.create(createDto);
  }

  @Put('/update')
  @ApiOperation({
    summary: 'update TCD Update',
    description: 'update TCD Update',
    operationId: 'update TCD Update',
  })
  public async update(@Body() updateDto: TCDUpdatesUpdateDto): Promise<void> {
    return this.tcdUpdateService.update(updateDto);
  }

  @Get('/get/:id')
  @ApiOperation({
    summary: 'get TCD Update',
    description: 'get TCD Update',
    operationId: 'get TCD Update',
  })
  public async get(@Param('id') id: string): Promise<TCDUpdates> {
    return this.tcdUpdateService.get(id);
  }

  @Put('/delete/:id')
  @ApiOperation({
    summary: 'delete TCD Update',
    description: 'delete TCD Update',
    operationId: 'delete TCD Update',
  })
  public async delete(@Param('id') id: string): Promise<void> {
    return this.tcdUpdateService.delete(id);
  }
}
