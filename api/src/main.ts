import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('SQLSense Platform API')
    .setDescription(
      'API del proyecto SQLSense: autenticación JWT, usuarios, cursos, retos, generación de schemas y mock data con IA.',
    )
    .setVersion('0.0.1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'JWT',
    )
    .addTag('Auth', 'Login, refresh, logout, profile')
    .addTag('Users', 'Gestión de usuarios y roles')
    .addTag('Cursos', 'CRUD de cursos (PROFESSOR/ADMIN)')
    .addTag('Retos', 'CRUD de retos SQL')
    .addTag('Schemas', 'Generación de schemas con IA')
    .addTag('Mock Data', 'Generación de mock data con IA')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
