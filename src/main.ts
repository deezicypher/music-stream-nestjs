import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedService } from './seed/seed.service';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
 
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  // const seedService = app.get(SeedService)
  // seedService.seed()
  const config = new DocumentBuilder()
  .setTitle('Spotify Clone')
  .setDescription('Spotify clone api documentation')
  .setVersion('1.0')
  .addBearerAuth({
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    name: "JWT",
    description: "Enter JWT token",
    in: "header",
  },"JWT-Auth")
  .build()
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api',app, document)
  const configService = app.get(ConfigService)
  await app.listen(configService.get<number>('port') ?? 3000);
}
bootstrap();
