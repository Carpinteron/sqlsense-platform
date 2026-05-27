import { ApiProperty } from '@nestjs/swagger';

export class DeleteChallengeResponseDto {
  @ApiProperty({ example: 'Reto eliminado exitosamente' })
  message!: string;
}
