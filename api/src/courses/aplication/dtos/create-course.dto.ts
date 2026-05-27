import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'Arquitectura de Software' })
  @IsString()
  @MinLength(1)
  name!: string;

  @ApiProperty({ example: 'ARQ-401' })
  @IsString()
  @MinLength(1)
  code!: string;

  @ApiProperty({ example: '2026-1', description: 'Período académico' })
  @IsString()
  @MinLength(1)
  period!: string;

  @ApiPropertyOptional({ example: '2', description: 'Número de grupo' })
  @IsOptional()
  @IsString()
  groupNumber?: string;
}
