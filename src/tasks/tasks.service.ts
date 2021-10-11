import { Injectable, NotFoundException } from '@nestjs/common';
import CreateTaskDto from './dto/create-task.dto';
import GetTasksFilterDto from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import 'reflect-metadata';
import TasksRepository from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import Task from './task.entity';

@Injectable()
export class TasksService {
	constructor (
		@InjectRepository(TasksRepository)
		private tasksRepository: TasksRepository,
	) {}

	// private tasks: Task[] = plainToClass(Task, taskObjects)

	// getTasks (): Task[] {
	// 	return this.tasks;
	// }
	createTask (createTaskDto: CreateTaskDto): Promise<Task> {
		return this.tasksRepository.createTask(createTaskDto);
	}
	async getTaskById (id: string): Promise<Task> {
		const task = await this.tasksRepository.findOne(id);
		if (task) return task;
		else throw new NotFoundException(`task with ID ${id} not found`);
	}
	async deleteTask (id: string): Promise<void> {
		const deleteResult = await this.tasksRepository.delete(id);
		if (deleteResult.affected === 0)
			throw new NotFoundException(`task with ID ${id} not found`);
		console.log(deleteResult);
	}
	async updateTaskStatus (
		id: string,
		status: TaskStatus,
	): Promise<Task> {
		const toUpdate = await this.getTaskById(id);
		if (toUpdate.id)
			await this.tasksRepository.update(id, { status });
		console.log(toUpdate);
		return toUpdate;
	}
	// getTasksFilter (getTasksFilterDto: GetTasksFilterDto) {
	// 	const { status, searchTerm } = getTasksFilterDto;
	// 	let tasks: Task[] = this.tasks;
	// 	if (status) {
	// 		tasks = this.tasks.filter((task) => task.status === status);
	// 	}
	// 	if (searchTerm) {
	// 		const regExp = new RegExp(searchTerm.toLowerCase(), 'g');
	// 		tasks = tasks.filter(
	// 			(task) =>
	// 				regExp.test(task.title.toLowerCase()) ||
	// 				regExp.test(task.description.toLowerCase()),
	// 		);
	// 	}
	// 	return tasks;
	// }
}
