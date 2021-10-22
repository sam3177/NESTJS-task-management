import TasksService from './tasks.service';
import { Test } from '@nestjs/testing';
import TasksRepository from './tasks.repository';
import { TaskStatus } from './task-status.enum';

const mockTasksRepository = () => ({
	getTasks: jest.fn(),
	findOne: jest.fn(),
	createTask: jest.fn(),
	delete: jest.fn(),
  update: jest.fn(),
});
const mockUser = {
	username: 'test',
	password: 'testPassword',
	id: 'testId',
	tasks: [],
};
const mockTasks = [
	{
		id: '1',
		title: 't1',
		description: 'd1',
		status: TaskStatus.OPEN,
	},
	{
		id: '2',
		title: 't2',
		description: 'd2',
		status: TaskStatus.DONE,
	},
];

describe('TasksService', () => {
	let tasksService: TasksService;
	let tasksRepository;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				TasksService,
				{
					provide: TasksRepository,
					useFactory: mockTasksRepository,
				},
			],
		}).compile();

		tasksService = moduleRef.get(TasksService);
		tasksRepository = moduleRef.get(TasksRepository);
	});
	describe('getTasks', () => {
		it('calls tasksRepository.getTasks and returns the result', async () => {
			tasksRepository.getTasks.mockResolvedValue(mockTasks);
			const result = await tasksService.getTasks(null, mockUser);
			expect(result).toHaveLength(2);
		});
	});
	describe('createTask', () => {
		it('calls tasksRepository.createTask and returns the result', async () => {
			tasksRepository.createTask.mockResolvedValue(mockTasks[0]);
			const result = await tasksService.createTask(null, mockUser);
			expect(result).toEqual(mockTasks[0]);
		});
	});
	describe('getTaskById', () => {
		it('calls tasksRepository.findOne and returns the result', async () => {
			tasksRepository.findOne.mockResolvedValue(mockTasks[0]);
			const result = await tasksService.getTaskById('1', mockUser);
			expect(result).toEqual(mockTasks[0]);
		});
		it('calls tasksRepository.findOne and handles an error', async () => {
			tasksRepository.findOne.mockResolvedValue(null);
			const result = tasksService.getTaskById('1', mockUser);
			expect(result).rejects.toThrow();
		});
	});
	describe('deleteTask', () => {
		it('calls tasksRepository.delete and deletes a task', async () => {
			tasksRepository.delete.mockResolvedValue({ affected: 1 });
			const result = tasksService.deleteTask('1', mockUser);
			expect(result).resolves.toBeUndefined()
		});
		it('calls tasksRepository.delete and handles an error', async () => {
			tasksRepository.delete.mockResolvedValue({ affected: 0 });
			const result = tasksService.deleteTask('1', mockUser);
			expect(result).rejects.toThrow();
		});
	});
	describe('updateTaskStatus', () => {
		it('calls tasksRepository.delete and deletes a task', async () => {
      tasksRepository.findOne.mockResolvedValue(mockTasks[0])
			tasksRepository.update.mockResolvedValue({...mockTasks[0],status:TaskStatus.DONE});
			const result = tasksService.updateTaskStatus('1',TaskStatus.DONE, mockUser);
			expect(result).resolves.toEqual({...mockTasks[0],status:TaskStatus.DONE})
		});
		it('calls tasksRepository.delete and handle error', async () => {
      tasksRepository.findOne.mockResolvedValue(null)
			const result = tasksService.updateTaskStatus('1',TaskStatus.DONE, mockUser);
			expect(result).rejects.toThrow()
		});
	});
});
