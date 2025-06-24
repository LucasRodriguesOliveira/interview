import { Module } from '@nestjs/common';
import { TaskController } from './tasks/task.controller';
import { ProxyModule } from '../../infrastructure/proxy/proxy.module';
import { ExceptionModule } from '../../infrastructure/exception/exception.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisConfig } from '../../infrastructure/config/cache/redis.config';

@Module({
  imports: [
    ProxyModule.register(),
    ExceptionModule,
    CacheModule.registerAsync(redisConfig),
  ],
  controllers: [TaskController],
})
export class ControllerModule {}
