import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    logger.log('Starting superAdmin service...');

    // HTTP Server (GraphQL)
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    const configService = app.get(ConfigService);

    const port = Number(configService.get<number>('PORT')) || 3000;
    logger.log(`Initializing HTTP server on port ${port}`);

    // Enable CORS
    app.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });
    logger.log('CORS enabled');

    // RabbitMQ Microservice
    logger.log('Initializing RabbitMQ microservice...');
    const rmqService = app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [configService.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672'],
        queue: configService.get<string>('RABBITMQ_QUEUE') || 'superadmin_queue',
        queueOptions: {
          durable: false,
        },
      },
    });

    // Start both HTTP and RabbitMQ
    await app.startAllMicroservices();
    await app.listen(port);
    logger.log(`🚀 HTTP server is running on http://localhost:${port}`);
    logger.log('📡 RabbitMQ microservice is listening');
    logger.log('✅ superAdmin service is ready');
  } catch (error) {
    Logger.error('❌ Failed to start service:', error);
    process.exit(1);
  }
}

bootstrap();