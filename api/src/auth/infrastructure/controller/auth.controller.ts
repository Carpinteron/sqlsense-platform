import { Controller, Post, Body, UnauthorizedException, Get, UseGuards, Request, SetMetadata } from '@nestjs/common';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { LogoutUseCase } from '../../application/use-cases/logout.use-case';
import { AuthGuard } from '@nestjs/passport'; 
import { RolesGuard } from '../guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @Post('refresh')
  async refresh(@Body() body: { refresh_token: string }) {
    if (!body.refresh_token) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return this.refreshTokenUseCase.execute(body.refresh_token);
  }
  
  @Post('login')
  async login(@Body() body: { email: string; pass: string }) {
  return this.loginUseCase.execute(body.email, body.pass);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt')) 
  async logout(@Request() req) {
    await this.logoutUseCase.execute(req.user.id);
    return { message: 'Sesión cerrada exitosamente' };
  }

  // TODO REMOVE LATER: Endpoint de prueba para verificar que la autenticación funciona
  // --- ENDPOINT NO PROTEGIDO (Público) ---
  // Útil para que Docker o Kubernetes sepan si el contenedor está vivo
  @Get('health')
  healthCheck() {
    return {
      status: 'up',
      timestamp: new Date().toISOString(),
      redis: 'connected', // Aquí podrías luego añadir lógica real de chequeo
    };
  }

  // --- ENDPOINT PROTEGIDO ---
  // Requiere un Token JWT válido y, en este caso, rol de ADMIN
  @Get('profile')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['ADMIN']) // Solo los ADMIN pueden ver esto
  getProfile(@Request() req) {
    // req.user viene de lo que configuraste en JwtStrategy.validate()
    return {
      message: 'Este es un endpoint protegido',
      user: req.user, 
    };
  }
}