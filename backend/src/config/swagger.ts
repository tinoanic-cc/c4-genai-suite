import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configureSwagger(app: INestApplication) {
  const config = new DocumentBuilder() //
    .setTitle('c4 GenAI Suite')
    .setDescription('c4 GenAI Suite')
    .setVersion('1.0')
    .addTag('chat')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);
}
