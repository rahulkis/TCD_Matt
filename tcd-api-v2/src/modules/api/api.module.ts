import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { PageModule } from './page/page.module';
import { PublicEntriesModule } from './public-entries/public-entries.module';
import { TCDUpdateModule } from './tcd-update/tcd-update.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    PageModule,
    PublicEntriesModule,
    AdminModule,
    TCDUpdateModule,
  ], //ProductModule
})
export class ApiModule {}
