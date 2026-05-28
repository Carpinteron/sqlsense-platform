import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  SetMetadata,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { LogoutUseCase } from '../../application/use-cases/logout.use-case';
import { RolesGuard } from '../guards/roles.guard';
import { LoginDto } from '../../application/dtos/login.dto';
import { RefreshTokenDto } from '../../application/dtos/refresh-token.dto';
import { AuthTokensResponseDto } from '../../application/dtos/auth-tokens-response.dto';
import { LogoutResponseDto } from '../../application/dtos/logout-response.dto';
import { AuthHealthResponseDto } from '../../application/dtos/auth-health-response.dto';
import { AuthProfileResponseDto } from '../../application/dtos/auth-profile-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión', description: 'Devuelve access_token y refresh_token JWT.' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Credenciales válidas', type: AuthTokensResponseDto })
  @ApiUnauthorizedResponse({ description: 'Credenciales incorrectas' })
  async login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto.email, dto.password);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Renovar tokens', description: 'Intercambia un refresh_token válido por nuevos tokens.' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Tokens renovados', type: AuthTokensResponseDto })
  @ApiUnauthorizedResponse({ description: 'Refresh token inválido o expirado' })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.refreshTokenUseCase.execute(dto.refresh_token);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Cerrar sesión',
    description: 'Invalida el refresh token en Redis. Requiere Bearer JWT (access).',
  })
  @ApiResponse({ status: 200, description: 'Sesión cerrada', type: LogoutResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido' })
  async logout(@Request() req: { user: { id: number } }) {
    await this.logoutUseCase.execute(req.user.id);
    return { message: 'Sesión cerrada exitosamente' };
  }

  @Get('health')
  @ApiOperation({
    summary: 'Health check',
    description: 'Endpoint público para comprobar que la API está viva.',
  })
  @ApiResponse({ status: 200, description: 'Servicio operativo', type: AuthHealthResponseDto })
  healthCheck() {
    return {
      status: 'up',
      timestamp: new Date().toISOString(),
      redis: 'connected',
    };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['ADMIN'])
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Perfil de prueba (solo ADMIN)',
    description: 'Endpoint protegido con JWT y rol ADMIN. Demuestra Bearer + RolesGuard.',
  })
  @ApiResponse({ status: 200, description: 'Usuario autenticado', type: AuthProfileResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido' })
  @ApiResponse({ status: 403, description: 'Rol insuficiente (no ADMIN)' })
  getProfile(@Request() req: { user: { id: number; email: string; role: string } }) {
    return {
      message: 'Este es un endpoint protegido',
      user: req.user,
    };
  }
}
