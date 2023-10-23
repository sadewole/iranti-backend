import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  const port = process.env.PORT || 3000;
  await app.listen(port);

  const url = await app.getUrl();

  const swagger = new DocumentBuilder()
    .setTitle('Iranti API')
    .setDescription('The Iranti Api documentation')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();
  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('api/docs', app, document);

  Logger.log(`🚀 Application is running on: ${url}/${globalPrefix}/v1`);
  Logger.log(`Swagger Docs is running on: ${url}/api/docs`);
}

bootstrap();
