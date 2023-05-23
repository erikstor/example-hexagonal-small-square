import {Injectable} from '@nestjs/common';
import * as axios from 'axios'
import {ConfigService} from "@nestjs/config";

@Injectable()
export class HttpService {

    constructor(
        private readonly configService: ConfigService
    ) {
    }

    async request(): Promise<any> {

        // todo trasladar este objeto a una interfaz y revisar si el configService es necesario
        return axios.default({
            method: 'post',
            url: '/user/12345',
            data: {
                firstName: 'Fred',
                lastName: 'Flintstone'
            },
            headers: {
                'Authorization': '',
                'Content-Type': 'application/json'
            }
        });

    }

    async findOneById(id: number): Promise<any> {
        //todo peticion con axios al microservicio de usuarios
    }

    async findRoleByName(name: string) {
        //todo peticion con axios al microservicio de usuarios
    }

}
