import User from '../auth/user.entity';
import CreateTaskDto from './dto/create-task.dto';
import GetTasksFilterDto from './dto/get-tasks-filter.dto';
import Task from './task.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { TaskStatus } from './task-status.enum';

@EntityRepository(Task)
export default class TasksRepository extends Repository<Task> {
	logger = new Logger('TaskRepository');
	
	async getTasks (
		getTasksFilterDto: GetTasksFilterDto,
		user: User,
	): Promise<Task[]> {
		const query = this.createQueryBuilder('task');
		const { status, searchTerm } = getTasksFilterDto;
		query.where({ user });
		if (status) query.andWhere('task.status = :status', { status });
		if (searchTerm)
			query.andWhere(
				'(LOWER(task.title) LIKE LOWER(:searchTerm) OR LOWER(task.description) LIKE LOWER(:searchTerm))',
				{ searchTerm: `%${searchTerm}%` },
			);
		try {
			const tasks = await query.getMany();
			return tasks;
		} catch (err) {
			this.logger.error(err.message, err.stack);
			throw new InternalServerErrorException();
		}
	}

	async createTask (
		createTaskDto: CreateTaskDto,
		user: User,
	): Promise<Task> {
		const { title, description } = createTaskDto;
		const newTask = this.create({
			title,
			description,
			status: TaskStatus.OPEN,
			user,
		});
		await this.save(newTask);
		return newTask;
	}
}
