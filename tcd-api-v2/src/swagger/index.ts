import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { Response } from 'express';

export function getSwaggerDocument(
  app: INestApplication,
  basePath: string,
): OpenAPIObject {
  const options = new DocumentBuilder()
    .setTitle('TCD')
    .setDescription('AWS API Gateway proxied')
    .setVersion('1.0')
    .addBearerAuth(undefined, 'Azure')
    .addCookieAuth('auth')
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, options);

  return document;
}

export function swaggerConfig(
  app: INestApplication,
  basePath: string,
  uiPath: string,
  specPath: string,
) {
  const document = getSwaggerDocument(app, basePath);
  SwaggerModule.setup(uiPath, app, document);
  app.use(specPath, (_req, res: Response, _next) => res.send(document));
}
