import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  const configService = app.get(ConfigService);

  const RABBIT_USER = configService.get('RABBITMQ_USER');
  const RABBIT_PASSWORD = configService.get('RABBITMQ_PASS');
  const RABBIT_HOST = configService.get('RABBITMQ_HOST');
  const RABBIT_AUTH_QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${RABBIT_USER}:${RABBIT_PASSWORD}@${RABBIT_HOST}`],
      noAck: false,
      queue: RABBIT_AUTH_QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  });

  app.startAllMicroservices();
}
bootstrap();
