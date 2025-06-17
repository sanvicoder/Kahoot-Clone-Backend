import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // 👈 import this

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  //enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties that don't have decorators
      forbidNonWhitelisted: true, // throws error if unknown properties are present
      transform: true, // auto-transforms payloads (e.g. string to number)
    }),
  );

  await app.listen(3000);
}
bootstrap();
