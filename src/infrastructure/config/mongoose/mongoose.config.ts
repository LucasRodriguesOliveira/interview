import { ConfigService } from '@nestjs/config';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { IMongoDBConfig } from '../types/mongodb.interface';
import { MONGODB_TOKEN } from '../env/mongodb.env';

export const mongooseConfig: MongooseModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const { url, database, user, password } =
      configService.getOrThrow<IMongoDBConfig>(MONGODB_TOKEN.description!);
    return {
      uri: url,
      user,
      pass: password,
      authSource: 'admin',
      dbName: database,
    };
  },
};
