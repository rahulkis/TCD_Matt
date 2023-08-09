/*
// lambda.ts
import { Handler, Context } from 'aws-lambda';
import { Server } from 'http';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';

import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { swaggerConfig } from './config/swagger';
import { Response } from 'express';

import express from 'express';

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes: string[] = [];

let cachedServer: Server;

function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('TCD API')
    .setDescription('TCD API Documetndation')
    .setVersion('1.0.0')
    .addTag('Api Tag')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}

async function bootstrapServer(): Promise<Server> {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
      { cors: true },
    );
    nestApp.use(eventContext());
    setupSwagger(nestApp);
    const document = SwaggerModule.createDocument(nestApp, swaggerConfig);
    const sWaggerApp: INestApplication = nestApp;
    setupSwagger
    nestApp.use('/swagger-spec.json', (_req, res: Response, _next) =>
      res.send(document),
    );
    await nestApp.init();
    cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
  }
  return cachedServer;
}

export const handler: Handler = async (event: any, context: Context) => {
  console.log('path', event.path);
  if (event.path === '/api') {
    event.path = '/api/';
  }
  console.log(process.env.DATABASE_HOST);
  event.path = event.path.includes('swagger-ui')
    ? `/api$(event.path)`
    : event.path;

  console.log('new-path', event.path);
  cachedServer = await bootstrapServer();
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};
*/