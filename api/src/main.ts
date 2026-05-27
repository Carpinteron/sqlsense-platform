import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// DTOs registrados explícitamente para asegurar que Swagger incluya sus propiedades
import { CreateSubmissionDto } from './submissions/application/dtos/create-submission.dto';
import { SubmissionCreatedResponseDto } from './submissions/application/dtos/submission-created-response.dto';
import { GenerateExpectedQueryDto } from './expected-query/application/dtos/generate-expected-query.dto';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const corsOrigins =
    configService.get<string>('CORS_ORIGINS') ??
    'http://localhost:3000,http://127.0.0.1:3000';
  const allowedOrigins = corsOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

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
    .addTag('Evaluations', 'CRUD de evaluaciones SQL')
    .addTag('Analytics', 'Métricas globales de la plataforma')
    .addTag('Schemas', 'Generación de schemas con IA')
    .addTag('Mock Data', 'Generación de mock data con IA')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [CreateSubmissionDto, SubmissionCreatedResponseDto, GenerateExpectedQueryDto],
  });
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
