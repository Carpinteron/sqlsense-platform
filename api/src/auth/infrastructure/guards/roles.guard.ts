import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Busca roles en el metodo 
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
    ]);

    // Si no hay roles definidos la ruta es publica 
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // si no hay usuario o no tiene rol denegamos
    if (!user || !user.role) {
      return false; 
    }

    // verificamos si el rol del usuario está en la lista de roles permitidos
    const hasRole = roles.includes(user.role);
    
    if (!hasRole) {
      throw new ForbiddenException('No tienes permisos para acceder a este recurso');
    }

    return true;
  }
}