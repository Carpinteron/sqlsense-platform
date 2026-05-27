import { ApiProperty } from '@nestjs/swagger';

export class DeleteCourseResponseDto {
  @ApiProperty({ example: 'Curso eliminado exitosamente' })
  message!: string;
}
