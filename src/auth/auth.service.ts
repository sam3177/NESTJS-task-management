import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import UsersRepository from './users.repository';
import AuthCredentialsDto from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import JwtPayload from './jwt.payload.interface';
import JwtToken from './jwt.token.interface';

@Injectable()
export class AuthService {
	constructor (
		@InjectRepository(UsersRepository)
		private usersRepository: UsersRepository,
		private jwtService: JwtService,
	) {}
	signUp (authCredentialsDto: AuthCredentialsDto): Promise<void> {
		return this.usersRepository.createUser(authCredentialsDto);
	}
	async signIn (
		authCredentialsDto: AuthCredentialsDto,
	): Promise<JwtToken> {
		const userToLogIn = await this.usersRepository.findUser(
			authCredentialsDto,
		);
		console.log(userToLogIn);
		const { password, username } = userToLogIn;
		const match = await bcrypt.compare(
			authCredentialsDto.password,
			password,
		);
		if (match) {
			console.log(match)
			const payload: JwtPayload = { username };
			const accessToken = await this.jwtService.sign(payload);
			return { accessToken };
		} else throw new UnauthorizedException('WRONG PASSWORD!');
	}
}
