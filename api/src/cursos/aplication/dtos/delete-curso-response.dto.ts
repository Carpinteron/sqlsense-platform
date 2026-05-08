import { ApiProperty } from '@nestjs/swagger';

export class DeleteCursoResponseDto {
  @ApiProperty({ example: 'Curso eliminado exitosamente' })
  message!: string;
}
