import { ApiProperty } from '@nestjs/swagger';

export class DeleteRetoResponseDto {
  @ApiProperty({ example: 'Reto eliminado exitosamente' })
  message!: string;
}
