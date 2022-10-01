import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { version, author } from '../package.json';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
console.log(process.env.TZ);
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  const configService = app.get(ConfigService);

  //configure swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Book Store API')
    .setDescription('Application for Book Store')
    .setVersion(version)
    .setContact(author, '', '')
    .addBearerAuth()
    .addServer(configService.get('APP_URL'))
    .build();

  if (configService.get('STAGE') === 'dev') {
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { defaultModelsExpandDepth: -1 },
    });
  }

  //configure static folder for static files
  app.useStaticAssets(join(__dirname, '..', 'public'));

  //configure validation pipes
  app.useGlobalPipes(new ValidationPipe());

  //starting server
  const port = configService.get('PORT') ?? 3000;
  await app.listen(port);
}
bootstrap();
