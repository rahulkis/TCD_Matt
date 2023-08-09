import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchLogs } from '../../../entity/search-logs.entity';
import { UserBlocked } from '../../../entity/blocked-user.entity';
import { PublicEntriesController } from './public-entires.controller';
import { PublicEntriesService } from './public-entries.service';
import { User } from '../../../entity/user.entity';
import { Product } from '../../../entity/product.entity';
import { Diary } from '../../../entity/diary.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserBlocked, SearchLogs, User, Product, Diary]),
  ],
  controllers: [PublicEntriesController],
  providers: [PublicEntriesService],
})
export class PublicEntriesModule {}
