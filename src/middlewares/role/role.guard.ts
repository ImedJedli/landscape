import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ROLES_KEY } from './role.decorator';
import { Role } from 'src/data/interfaces';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      console.log('No roles specified for this route.');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('User:', user);

    if (!user || !user.role) {
      throw new UnauthorizedException('Unauthorized access');
    }

    const hasRequiredRole = requiredRoles.some((role) =>
      user.role.includes(role),
    );

    if(!hasRequiredRole){

      throw new ForbiddenException('You do not have permission to access this resource , invalid user role ');
    }
    return true;
  }
}
