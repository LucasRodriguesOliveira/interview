import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseDefinitions } from '../database/mongodb/definition/definitions';
import { ServiceModule } from '../service/service.module';
import { RepositoryModule } from '../repository/repository.module';
import { TaskProxies } from './tasks/task.proxy';

@Module({
  imports: [
    MongooseModule.forFeature(mongooseDefinitions),
    ServiceModule,
    RepositoryModule,
  ],
})
export class ProxyModule {
  static register(): DynamicModule {
    return {
      module: ProxyModule,
      providers: [...TaskProxies.values()],
      exports: [...TaskProxies.keys()],
    };
  }
}
