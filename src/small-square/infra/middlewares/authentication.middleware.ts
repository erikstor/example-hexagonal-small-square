import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import {UsersService} from "../../app/users.service";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async use(req: any, res: any, next: () => void) {
    try {
      if (!req.headers.authorization) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      this.jwtService.verify(req.headers.authorization, {
        publicKey: 'secret',
      });

      req.user = this.jwtService.decode(req.headers.authorization);
      const user = await this.userService.findOneById(<number>req.user.id);

      if (!user) {
        throw new HttpException(
          `Usted no tiene acceso a esta funcionalidad`,
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (e) {
      throw new HttpException(e.message, e.status || HttpStatus.UNAUTHORIZED);
    }
    next();
  }
}