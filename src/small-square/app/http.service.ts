import {HttpException, Injectable} from '@nestjs/common';
import * as axios from 'axios'
import {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";

@Injectable()
export class HttpService {

    async request(options: AxiosRequestConfig): Promise<any> {

        let error: AxiosError

        const resp: AxiosResponse | void = await axios.default(options)
            .then((resp: AxiosResponse) => {
                return resp
            }).catch((err: AxiosError) => {
                error = err
            });

        if (error) {            
            throw new HttpException(
                {
                    message: 'El consumo de un servicio externo fallo',
                    detail: {
                        message: 'El consumo de un servicio externo fallo',
                        detail: error.response.data['message'] || error.response.data["message"] || error.message,
                        request: options
                    }
                },
                error.response.status
            )
        }

        return {...resp}
    }

}
