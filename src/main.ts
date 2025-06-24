import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from './infrastructure/config/types/app.interface';
import { APP_TOKEN } from './infrastructure/config/env/app.env';
import helmet from 'helmet';
import { HttpExceptionFilter } from './infrastructure/common/filter/exception.filter';
import { ExtendedNestLoggerService } from './infrastructure/service/logger/extended-nest-logger.service';
import { SwaggerConfig } from './infrastructure/config/types/swagger.interface';
import { SWAGGER_TOKEN } from './infrastructure/config/env/swagger.env';
import { SwaggerModule } from '@nestjs/swagger';
import { createSwaggerDocument } from './infrastructure/config/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: '*' },
  });
  const configService = app.get<ConfigService>(ConfigService);

  const { docs } = configService.get<SwaggerConfig>(
    SWAGGER_TOKEN.description!,
  )!;

  SwaggerModule.setup(
    docs.path,
    app,
    createSwaggerDocument(app, configService),
  );

  const { port } = configService.getOrThrow<IAppConfig>(APP_TOKEN.description!);

  app.use(helmet());

  app.useGlobalFilters(
    new HttpExceptionFilter(new ExtendedNestLoggerService()),
  );

  await app.listen(port);
}
bootstrap();
