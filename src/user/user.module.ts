// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // ⬅️ این خط حیاتی هست!
  ],
  providers: [UserService],
  exports: [UserService], // برای استفاده در AuthModule و TaskModule
})
export class UserModule {}
