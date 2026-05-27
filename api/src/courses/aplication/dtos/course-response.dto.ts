import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CourseResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'Arquitectura de Software' })
  name!: string;

  @ApiProperty({ example: 'ARQ-401' })
  code!: string;

  @ApiProperty({ example: '2026-1' })
  period!: string;

  @ApiPropertyOptional({ example: '2', nullable: true })
  groupNumber?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID del profesor asignado' })
  professorId?: number;

  @ApiPropertyOptional({ example: '2026-01-01T00:00:00.000Z' })
  createdAt?: Date | string;
}
