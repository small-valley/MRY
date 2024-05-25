import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { config } from "dotenv";
import "reflect-metadata";
import { AppModule } from "./app/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({ origin: /^http:\/\/localhost:\d+$/ });

  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle("MRY API")
    .setDescription("The API description")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT access token gotten from POST:/auth/signin api",
        in: "header",
      },
      "JWT"
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("swagger", app, document);

  config({ path: "../.env" });
  const SERVER_PORT: number = parseInt(process.env.SERVER_PORT) || 4000;

  await app.listen(SERVER_PORT);
  console.log(`Swagger running on http://localhost:${SERVER_PORT}/swagger`);
}
bootstrap();
