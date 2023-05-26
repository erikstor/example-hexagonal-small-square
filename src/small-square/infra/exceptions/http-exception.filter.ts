import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';
import {Request, Response} from 'express';
import {isArray} from "class-validator";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();


        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: exception.message || exception.getResponse()['message'][0],
            detail: this.getDetail(exception),
            more_info: exception.getResponse()['detail']?.response || exception.getResponse()['detail'] // util para el consumo externo de apis
        });
    }

    getDetail(exception: HttpException): string {

        if (exception.getResponse()['response']?.detail?.detail) {
            return exception.getResponse()['response'].detail.detail
        } else if (exception.message === exception.getResponse()['message']) {
            return ''
        } else if (isArray(exception.getResponse()['message'])) {
            return exception.getResponse()['message']
        }

        return null
    }
}