import { EntityRepository, Repository } from 'typeorm';
import User from './user.entity';
import AuthCredentialsDto from './dto/auth-credentials.dto';
import {
	ConflictException,
	InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
	async createUser (authCredentialsDto: AuthCredentialsDto): Promise<void> {
		const { username, password } = authCredentialsDto;
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, salt);
		const newUser = this.create({
			username,
			password:hashedPassword,
		});
		try {
			await this.save(newUser);
		} catch (err) {
			if (err.code === '23505')
				throw new ConflictException(
					`'${username}' is already in use!`,
				);
			else throw new InternalServerErrorException();
		}
	}
  async findUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {
		const { username} = authCredentialsDto;
    const user = await this.findOne({ username})
    if(user) return user
    else throw new NotFoundException(`'${username}' not found`);
  }
}
