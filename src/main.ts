import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Logger, ValidationPipe} from "@nestjs/common";
import {HttpExceptionFilter} from "./small-square/infra/exceptions/http-exception.filter";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const logger = new Logger()

    const config = new DocumentBuilder()
        .setTitle('Microservicio de plazoleta')
        .setDescription('Api que expone las funcionalidades correspondientes al microservicio de la plazoleta')
        .setVersion('1.0')
        .addBearerAuth()
        .addServer('api')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('', app, document);

    app.setGlobalPrefix('api')
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        })
    )
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.listen(process.env.PORT || 3000);
    logger.log(`App running on port ${process.env.PORT}`)
}

bootstrap();
