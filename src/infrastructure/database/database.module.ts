import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseDefinitions } from './mongodb/definition/definitions';

@Module({
  imports: [MongooseModule.forFeature(mongooseDefinitions)],
})
export class DatabaseModule {}
