// src/orm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  // username: process.env.DB_USERNAME || 'postgres',
  username: 'postgres',
  // password: process.env.DB_PASSWORD || 'Aa@123456', // همون رمزی که موقع نصب گذاشتی
  password: 'Aa@123456', // همون رمزی که موقع نصب گذاشتی
  // database: process.env.DB_DATABASE || 'taskflow_dev',
  database: 'taskflow_dev',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  // synchronize: process.env.NODE_ENV !== 'production', // فقط در dev دیتابیس رو خودکار تغییر بده
  synchronize: true, // فقط در dev دیتابیس رو خودکار تغییر بده
};

export default config;
