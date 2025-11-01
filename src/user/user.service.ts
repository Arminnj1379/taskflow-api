import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async create(email: string, passwordHash: string): Promise<User> {
    const user = this.userRepository.create({ email, password: passwordHash });
    return await this.userRepository.save(user);
  }
}
