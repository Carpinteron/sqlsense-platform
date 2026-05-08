import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
  @ApiProperty({ example: 'Sesión cerrada exitosamente' })
  message!: string;
}
