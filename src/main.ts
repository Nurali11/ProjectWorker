import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle('Shop Project')
  .setDescription('The shop API description')
  .setVersion('1.0')
  .addSecurityRequirements('bearer', ['bearer'])
  .addBearerAuth()
  .build();

const documentFactory = () => SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, documentFactory);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
