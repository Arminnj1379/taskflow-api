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

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOneBy({ username });
  }

  async create(
    email: string,
    passwordHash: string,
    name: string,
    lastname: string,
    username: string,
  ): Promise<User> {
    const user = this.userRepository.create({
      email,
      password: passwordHash,
      name: name,
      lastname: lastname,
      username: username,
    });
    return this.userRepository.save(user);
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async updatePassword(
    id: number,
    newPasswordHash: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (user != null) {
      user.password = newPasswordHash;
      return this.userRepository.save(user);
    }
    return null;
  }

  async getAllUsers(): Promise<User[] | null> {
    return this.userRepository.find();
  }

  async countAllUsers(): Promise<number> {
    return this.userRepository.count();
  }
}
