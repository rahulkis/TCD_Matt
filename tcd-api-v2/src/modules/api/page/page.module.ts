import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CmsPages } from '../../../entity/cmspages.entity';
import { PageController } from './page.controller';
import { PageService } from './page.service';

@Module({
  imports: [TypeOrmModule.forFeature([CmsPages])],
  controllers: [PageController],
  providers: [PageService],
})
export class PageModule {}
