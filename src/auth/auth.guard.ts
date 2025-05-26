import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private readonly jwt: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const req: Request = context.switchToHttp().getRequest();

    const token = req.headers.authorization?.split(' ')?.[1];

    if(!token){
      throw new UnauthorizedException('Token not provided')
    }
    
    try {
      let data = this.jwt.verify(token, {secret: "access"})
      req['user'] = {
        id: data['id'],
        role: data['role']
      }
      
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }
}
