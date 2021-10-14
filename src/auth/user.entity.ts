import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Task from '../tasks/task.entity'

@Entity()
export default class User {
	@PrimaryGeneratedColumn('uuid') id: string;

	@Column({unique: true}) username: string;

	@Column() password: string;

  @OneToMany(()=>Task , (task:Task) => task.user, {eager: true})
  tasks: Task[];
}
