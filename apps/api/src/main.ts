import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const uploadDir = process.env.UPLOAD_DIR || "uploads";
  app.useStaticAssets(join(process.cwd(), uploadDir), {
    prefix: "/uploads/",
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
