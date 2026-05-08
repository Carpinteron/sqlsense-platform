import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateRetoDto {
  @ApiPropertyOptional({ example: 'SELECT_BASICO_001' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Nueva descripción del reto' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ['Easy', 'Medium', 'Hard'], example: 'Medium' })
  @IsOptional()
  @IsIn(['Easy', 'Medium', 'Hard'])
  difficulty?: 'Easy' | 'Medium' | 'Hard';

  @ApiPropertyOptional({ type: [String], example: ['group-by', 'aggregation'] })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional({ example: 'PostgreSQL' })
  @IsOptional()
  @IsString()
  databaseEngine?: string;

  @ApiPropertyOptional({ example: 90, description: 'Tiempo límite en segundos' })
  @IsOptional()
  @IsInt()
  @Min(1)
  timeLimit?: number;

  @ApiPropertyOptional({ enum: ['draft', 'published', 'archived'], example: 'published' })
  @IsOptional()
  @IsIn(['draft', 'published', 'archived'])
  status?: 'draft' | 'published' | 'archived';

  @ApiPropertyOptional({ example: 'CREATE TABLE ...' })
  @IsOptional()
  @IsString()
  schemaSql?: string;

  @ApiPropertyOptional({ example: 'INSERT INTO ...' })
  @IsOptional()
  @IsString()
  seedDataSql?: string;

  @ApiPropertyOptional({ example: { rows: [{ id: 1 }] } })
  @IsOptional()
  expectedResult?: object | null;
}
