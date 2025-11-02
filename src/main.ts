import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
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
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      docExpansion: 'none', // ← این خط باعث می‌شه همه تگ‌ها بسته باشن
    },
  }); // دسترسی از طریق /api
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
