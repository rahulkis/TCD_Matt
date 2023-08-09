import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TCDUpdatesCreateDto } from 'src/dto/tcd-update/tcd-update-create.dto';
import { TCDUpdatesUpdateDto } from 'src/dto/tcd-update/tcd-update-update.dto';
import { TCDUpdates } from 'src/entity/tcd-updates.entity';
import { tcdUpdateCategoryEnum } from 'src/enums/tcd-update-category.enum';
import { Repository } from 'typeorm';

@Injectable()
export class TcdUpdateService {
  constructor(
    @InjectRepository(TCDUpdates)
    private readonly tcdUpdateRepository: Repository<TCDUpdates>,
  ) {}

  public async getList(): Promise<any> {
    const result = await this.tcdUpdateRepository.find({
      where: { is_deleted: false },
    });
    return result;
  }

  public getAllCategory() {
    const result = Object.values(tcdUpdateCategoryEnum);
    return result;
  }

  public async create(createDto: TCDUpdatesCreateDto): Promise<void> {
    const entity = new TCDUpdates();
    entity.title = createDto.title;
    entity.category = createDto.category;
    entity.description = createDto.description;
    entity.is_published = createDto.is_published;
    if (entity.is_published) {
      entity.published_at = new Date(Date.now());
    }
    await this.tcdUpdateRepository.save(entity);
  }

  public async update(updateDto: TCDUpdatesUpdateDto): Promise<void> {
    const entity = await this.tcdUpdateRepository.findOne({
      where: { id: updateDto.id, is_deleted: false },
    });

    if (entity === null) {
      throw new BadRequestException('TCD Update is not found');
    }

    if (entity.is_published === false && updateDto.is_published) {
      entity.published_at = new Date(Date.now());
    }

    entity.title = updateDto.title;
    entity.category = updateDto.category;
    entity.description = updateDto.description;
    entity.is_published = updateDto.is_published;

    await this.tcdUpdateRepository.save(entity);
  }

  public async get(id: string): Promise<TCDUpdates> {
    const entity = await this.tcdUpdateRepository.findOne({
      where: { id: id, is_deleted: false },
    });
    if (entity === null) {
      throw new BadRequestException('TCD Update is not found');
    }
    return entity;
  }

  public async delete(id: string): Promise<void> {
    const entity = await this.tcdUpdateRepository.findOne({
      where: { id: id, is_deleted: false },
    });
    if (entity === null) {
      throw new BadRequestException('TCD Update is not found');
    }
    entity.is_deleted = true;
    await this.tcdUpdateRepository.save(entity);
  }
}
