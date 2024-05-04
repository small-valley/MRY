import serverlessExpress from "@codegenie/serverless-express";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { Context, Handler } from "aws-lambda";
import express from "express";

import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./filter/exception.filter";

let cachedServer: Handler;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp)
    );

    // Enable CORS
    nestApp.enableCors({
      origin: [/^http:\/\/localhost:\d+$/, "https://mry-ciccc.me"],
    });

    // Set global exception filter
    nestApp.useGlobalFilters(
      new AllExceptionsFilter(nestApp.get(HttpAdapterHost))
    );

    await nestApp.init();

    cachedServer = serverlessExpress({ app: expressApp });
  }

  return cachedServer;
}

export const handler = async (event: any, context: Context, callback: any) => {
  const server = await bootstrap();
  return server(event, context, callback);
};
