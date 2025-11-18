import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- เพิ่มส่วนนี้ ---
  app.enableCors({
    origin: true, // อนุญาตทุก Origin (หรือจะใส่ 'http://localhost:3000' ก็ได้)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  // ------------------

  await app.listen(3000);
}
bootstrap();
