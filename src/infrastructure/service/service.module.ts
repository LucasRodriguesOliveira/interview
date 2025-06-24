import { Module } from '@nestjs/common';
import { CryptoService } from './crypto/crypto.service';
import { ExtendedNestLoggerService } from './logger/extended-nest-logger.service';

@Module({
  providers: [CryptoService, ExtendedNestLoggerService],
  exports: [CryptoService, ExtendedNestLoggerService],
})
export class ServiceModule {}
