import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getSwaggerDocument } from '../swagger';
import { swaggerConfig } from '../config/swagger';
import { writeFileSync } from 'fs';
import { classToPlain } from 'class-transformer';

NestFactory.create(AppModule, { bodyParser: true })
  .then((app) => {
    const swaggerDoc = getSwaggerDocument(app, 'api');
    const jsonDoc = classToPlain(swaggerDoc);
    const jsonString = JSON.stringify(jsonDoc);
    writeFileSync('./.swagger-spec.json', jsonString);
    process.exit();
  })
  .catch((err) => console.log(err));
