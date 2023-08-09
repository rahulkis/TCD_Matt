import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TCDUpdates } from 'src/entity/tcd-updates.entity';
import { TCDUpdateController } from './tcd-update.controller';
import { TcdUpdateService } from './tcd-update.service';

@Module({
  imports: [TypeOrmModule.forFeature([TCDUpdates])],
  controllers: [TCDUpdateController],
  providers: [TcdUpdateService],
})
export class TCDUpdateModule {}
