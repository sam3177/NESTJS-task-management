import { Exclude } from 'class-transformer';
import User from '../auth/user.entity';
import {
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from './task-status.enum';

@Entity()
export default class Task {
	@PrimaryGeneratedColumn('uuid') id: string;

	@Column() title: string;

	@Column() description: string;

	@Column() status: TaskStatus;

	@ManyToOne(() => User, (user: User) => user.tasks, { eager: false })
	@Exclude({ toPlainOnly: true })
	user: User;
}
