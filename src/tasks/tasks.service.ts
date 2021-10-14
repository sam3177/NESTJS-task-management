import { Injectable, NotFoundException } from '@nestjs/common';
import CreateTaskDto from './dto/create-task.dto';
import GetTasksFilterDto from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import 'reflect-metadata';
import TasksRepository from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import Task from './task.entity';
import User from 'src/auth/user.entity';

@Injectable()
export class TasksService {
	constructor (
		@InjectRepository(TasksRepository)
		private tasksRepository: TasksRepository,
	) {}

	// private tasks: Task[] = plainToClass(Task, taskObjects)

	getTasks (
		getTasksFilterDto: GetTasksFilterDto,
		user: User,
	): Promise<Task[]> {
		return this.tasksRepository.getTasks(getTasksFilterDto, user);
	}
	createTask (
		createTaskDto: CreateTaskDto,
		user: User,
	): Promise<Task> {
		return this.tasksRepository.createTask(createTaskDto, user);
	}
	async getTaskById (id: string, user: User): Promise<Task> {
		const task = await this.tasksRepository.findOne({where:{id, user}});
		if (task) return task;
		else throw new NotFoundException(`task with ID ${id} not found`);
	}
	async deleteTask (id: string, user: User): Promise<void> {
		const deleteResult = await this.tasksRepository.delete({id, user});
		if (deleteResult.affected === 0)
			throw new NotFoundException(`task with ID ${id} not found`);
	}
	async updateTaskStatus (
		id: string,
		status: TaskStatus,
		user: User,
	): Promise<Task> {
		const toUpdate = await this.getTaskById(id, user);
		toUpdate.status = status;
		await this.tasksRepository.update(id, { status });
		return toUpdate;
	}
}
