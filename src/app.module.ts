import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './tasks/task.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';

@Module({
  imports: [
    TasksModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'task-management-user',
      password: 'qi4CbEd6T09bJBfg',
      database: 'task-management',
      autoLoadEntities: true,
      entities: [Task, User],
      // Should not be set to true in production - it will drop all tables and recreate them
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
