import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateRetoDto {
  @ApiProperty({ example: 'SELECT_BASICO_001' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Escribe una consulta SQL para...' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiPropertyOptional({ enum: ['Easy', 'Medium', 'Hard'], example: 'Easy' })
  @IsOptional()
  @IsIn(['Easy', 'Medium', 'Hard'])
  difficulty?: 'Easy' | 'Medium' | 'Hard';

  @ApiPropertyOptional({ type: [String], example: ['joins', 'select'] })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional({ example: 'PostgreSQL' })
  @IsOptional()
  @IsString()
  databaseEngine?: string;

  @ApiPropertyOptional({ example: 60, description: 'Tiempo límite en segundos' })
  @IsOptional()
  @IsInt()
  @Min(1)
  timeLimit?: number;

  @ApiPropertyOptional({ enum: ['draft', 'published', 'archived'], example: 'draft' })
  @IsOptional()
  @IsIn(['draft', 'published', 'archived'])
  status?: 'draft' | 'published' | 'archived';

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID del curso (UUID)',
  })
  @IsOptional()
  @IsUUID()
  courseId?: string;

  @ApiPropertyOptional({
    example: 'CREATE TABLE ...',
    description: 'DDL que define el schema del reto',
  })
  @IsOptional()
  @IsString()
  schemaSql?: string;

  @ApiPropertyOptional({ example: 'INSERT INTO ...', description: 'Seed data opcional' })
  @IsOptional()
  @IsString()
  seedDataSql?: string;

  @ApiPropertyOptional({
    example: { rows: [{ id: 1, name: 'Ana' }] },
    description: 'Resultado esperado (JSON)',
  })
  @IsOptional()
  expectedResult?: object | null;
}
