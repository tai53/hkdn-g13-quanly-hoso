import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

// @Global: các module khác dùng được DatabaseService mà không cần import DatabaseModule.
@Global()
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
