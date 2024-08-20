import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<void> {
    return await this.usersRepository.createUser(createUserDto);
  }

  async signIn(loginCredentialsDto: LoginCredentialsDto): Promise<string> {
    const { username, password } = loginCredentialsDto;

    const user = await this.usersRepository.findOneBy({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid username or password!');
    }

    return 'success';
  }
}
