import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import TasksRepository from './tasks.repository';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [ TypeOrmModule.forFeature([ TasksRepository ]), AuthModule, ConfigModule ],
	controllers: [ TasksController ],
	providers: [ TasksService ],
})
export class TasksModule {}
