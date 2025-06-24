import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './infrastructure/config/env/env.config';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseConfig } from './infrastructure/config/mongoose/mongoose.config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { ControllerModule } from './interfaces/controller/controller.module';
import { ProxyModule } from './infrastructure/proxy/proxy.module';
import { LoggerModule } from 'nestjs-pino';
import { pinoConfig } from './infrastructure/config/pino/pino.config';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),
    LoggerModule.forRootAsync(pinoConfig()),
    MongooseModule.forRootAsync(mongooseConfig),
    DatabaseModule,
    ControllerModule,
    ProxyModule.register(),
  ],
})
export class AppModule {}
