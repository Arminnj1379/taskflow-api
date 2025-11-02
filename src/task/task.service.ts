import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './task.entity';
import { User } from '../user/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async createTask(
    user: User,
    title: string,
    description?: string,
  ): Promise<Task> {
    const task = this.taskRepository.create({
      title,
      description,
      user,
    });
    return this.taskRepository.save(task);
  }

  async findAllTasks(user: User): Promise<Task[]> {
    return this.taskRepository.find({ where: { user: { id: user.id } } });
  }

  async findOneTask(id: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: ['user'],
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.findOneTask(id, user);
    task.status = status;
    return this.taskRepository.save(task);
  }

  async deleteTask(id: number, user: User): Promise<void> {
    const result = await this.taskRepository.delete({
      id,
      user: { id: user.id },
    });
    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }
  }
}
