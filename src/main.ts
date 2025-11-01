import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Swagger
  const config = new DocumentBuilder()
    .setTitle('TaskFlow API')
    .setDescription('سرویس مدیریت تسک با احراز هویت و real-time notification')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Tasks')
    .addBearerAuth() // برای پشتیبانی از JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // دسترسی از طریق /api
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
