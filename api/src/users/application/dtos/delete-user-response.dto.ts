import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserResponseDto {
  @ApiProperty({ example: 'Usuario eliminado exitosamente' })
  message!: string;
}
