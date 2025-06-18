import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    TasksModule,
    MongooseModule.forRoot('mongodb://test:test@localhost:27017', {
      dbName: 'tasks',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
