import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  console.log('🚀 Worker de Evaluación iniciado y escuchando Redis...');
  
  // Esto mantiene el proceso vivo escuchando la cola
  app.enableShutdownHooks();
}
bootstrap();