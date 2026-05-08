import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCursoDto {
  @ApiPropertyOptional({ example: 'Arquitectura de Empresarial' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiPropertyOptional({ example: 'ARQ-402' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  code?: string;

  @ApiPropertyOptional({ example: '2026-2' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  period?: string;

  @ApiPropertyOptional({ example: '5' })
  @IsOptional()
  @IsString()
  groupNumber?: string;
}
