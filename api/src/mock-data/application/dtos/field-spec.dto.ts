import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateIf,
  ArrayMinSize,
} from 'class-validator';

export class FieldSpecDto {
  @ApiProperty({
    enum: ['int', 'decimal', 'varchar', 'date', 'enum', 'foreign_key', 'boolean', 'text'],
    example: 'decimal',
    description: 'Tipo de dato para este campo',
  })
  @IsString()
  type!: string;

  @ApiPropertyOptional({
    example: 'customers.id',
    description: 'Para foreign_key: referencia en formato "table.column"',
  })
  @IsOptional()
  @ValidateIf((o) => o.type === 'foreign_key')
  @IsString()
  references?: string;

  @ApiPropertyOptional({
    example: 10000,
    description: 'Valor mínimo (para int, decimal)',
  })
  @IsOptional()
  @IsNumber()
  min?: number;

  @ApiPropertyOptional({
    example: 5000000,
    description: 'Valor máximo (para int, decimal)',
  })
  @IsOptional()
  @IsNumber()
  max?: number;

  @ApiPropertyOptional({
    example: '2026-01-01',
    description: 'Fecha inicial en formato ISO (para date)',
  })
  @IsOptional()
  @IsString()
  from?: string;

  @ApiPropertyOptional({
    example: '2026-12-31',
    description: 'Fecha final en formato ISO (para date)',
  })
  @IsOptional()
  @IsString()
  to?: string;

  @ApiPropertyOptional({
    example: ['PENDING', 'PAID', 'CANCELLED'],
    description: 'Valores posibles (para enum)',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1, { message: 'values debe tener al menos un elemento para enum' })
  @ValidateIf((o) => o.type === 'enum')
  values?: string[];
}
