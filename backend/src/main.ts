import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { config } from "dotenv";
import "reflect-metadata";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./filter/exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({ origin: /^http:\/\/localhost:\d+$/ });

  // Set global exception filter
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));

  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle("MRY API")
    .setDescription("The API description")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("swagger", app, document);

  config({ path: "../.env" });
  const SERVER_PORT: number = parseInt(process.env.SERVER_PORT) || 4000;

  await app.listen(SERVER_PORT);
  console.log(`Swagger running on http://localhost:${SERVER_PORT}/swagger`);
}
bootstrap();
