import 'reflect-metadata';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskStatus } from './task-status.enum';
import CreateTaskDto from './dto/create-task.dto';
import GetTasksFilterDto from './dto/get-tasks-filter.dto';
import TasksRepository from './tasks.repository';
import Task from './task.entity';
import User from '../auth/user.entity';

@Injectable()
export default class TasksService {
	constructor (
		@InjectRepository(TasksRepository)
		private tasksRepository: TasksRepository,
	) {}
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
		const task = await this.tasksRepository.findOne({
			where: { id, user },
		});
		if (task) return task;
		else throw new NotFoundException(`task with ID ${id} not found`);
	}
	async deleteTask (id: string, user: User): Promise<void> {
		const deleteResult = await this.tasksRepository.delete({
			id,
			user,
		});
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
