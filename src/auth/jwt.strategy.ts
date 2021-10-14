import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import JwtPayload from './jwt.payload.interface';
import User from './user.entity';
import UsersRepository from './users.repository';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
	constructor (
		@InjectRepository(UsersRepository)
		private usersRepository: UsersRepository,
		private configService: ConfigService,
	) {
		super({
			secretOrKey: configService.get('JWT_SECRET'),
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		});
	}

	async validate (jwtPayload: JwtPayload): Promise<User> {
		const { username } = jwtPayload;
		const user: User = await this.usersRepository.findOne({username});
		if (user) return user;
		else throw new UnauthorizedException();
	}
}
