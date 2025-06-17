import * as fs from 'fs';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function writeOpenAPIToFile() {
  const app = await NestFactory.create(AppModule, { preview: true });
  app.setGlobalPrefix('api');
  const options = new DocumentBuilder()
    .setTitle('c4 GenAI Suite')
    .setDescription('c4 GenAI Suite')
    .setVersion('1.0')
    .addTag('chat')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  const json = JSON.stringify(document);
  const [, , localFile] = process.argv;

  if (localFile) {
    fs.writeFileSync('./backend-dev-spec.json', json);
  } else {
    fs.writeFileSync('./backend-spec.json', json);
  }
}

void writeOpenAPIToFile();
