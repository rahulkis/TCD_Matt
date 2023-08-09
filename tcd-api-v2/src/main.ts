import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { swaggerConfig } from './config/swagger';

async function bootstrap() {
  const logger = new Logger('main');
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix("api")
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('port');
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger-ui', app, document);
  await app.listen(PORT);
  logger.log(`Server is running on port - ${PORT}`);
}
bootstrap();
