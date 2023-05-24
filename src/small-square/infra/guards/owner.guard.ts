import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Request} from 'express';
import {OWNER_ROLE} from "../utils/constants/global";

@Injectable()
export class OwnerGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('Usted no tiene los permisos para usar esta funcionalidad');
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: 'secret'
                }
            );

            if (payload.role.nombre !== OWNER_ROLE) throw new UnauthorizedException('Usted no tiene los permisos para usar esta funcionalidad');

            request['user'] = payload;
        } catch {
            throw new UnauthorizedException('Usted no tiene los permisos para usar esta funcionalidad');
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}