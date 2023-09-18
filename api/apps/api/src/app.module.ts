import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'AUTH_SERVICE',
      useFactory: (configService: ConfigService) => {
        const RABBIT_USER = configService.get('RABBITMQ_USER');
        const RABBIT_PASSWORD = configService.get('RABBITMQ_PASS');
        const RABBIT_HOST = configService.get('RABBITMQ_HOST');
        const RABBIT_AUTH_QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${RABBIT_USER}:${RABBIT_PASSWORD}@${RABBIT_HOST}`],
            queue: RABBIT_AUTH_QUEUE,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
