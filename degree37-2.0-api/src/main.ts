import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import cors from 'cors';
import * as Sentry from '@sentry/node';
import { SentryInterceptor } from './common/interceptors/sentry.interceptor';
import { TimestampInterceptor } from './api/interceptors/timestamp.interceptor';
import * as bodyParser from 'body-parser';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.APP_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Degree37 2.0 API Documentation')
      .setDescription('Degree37 2.0 API Documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-documentation', app, document);
  }
  app.useGlobalInterceptors(new TimestampInterceptor());
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
  app.use(
    cors({
      origin: '*',
      // origin: process.env.ORIGIN_URL,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
    })
  );
  console.log('cors url===>', process.env.ORIGIN_URL);
  Sentry.init({
    dsn: process.env.SENTRY_DNS,
    tracesSampleRate: 1.0,
    environment: process.env.APP_ENV,
  });
  app.useGlobalInterceptors(new SentryInterceptor());
  //TODO: Enable Cors app.enableCors();
  await app.listen(process.env.APP_PORT);
}

bootstrap();
