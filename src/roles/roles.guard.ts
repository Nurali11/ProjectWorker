import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {ROLES_KEY} from './decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean {
    let roles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    
    
    const r = context.switchToHttp().getRequest()
    console.log("kirdi", r['user']);

    if(!roles.length) {
      return true
    }
    console.log(r['user'], r['user']['role']);
    
    if(roles.includes(r['user']['role'])) {
      return true
    }else{
      throw new UnauthorizedException('U have no access')
    }
  }
}
