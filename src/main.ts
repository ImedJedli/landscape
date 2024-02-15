import { NestFactory } from '@nestjs/core';
require("dotenv").config();

import { AppModule } from './app.module';
const db = require('../models');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(6000);

}
bootstrap();
 