import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  IsOptional,
  IsNumber,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PreviousSchemaDto } from './schema-table.dto';

export class RegenerateSchemaDto {
  @ApiProperty({
    example: 'halla la persona menor en la base de datos de una empresa',
    description: 'Descripción natural del schema a regenerar',
    minLength: 10,
  })
  @IsString()
  @MinLength(10, { message: 'prompt debe tener al menos 10 caracteres' })
  prompt!: string;

  @ApiProperty({
    description: 'Schema anterior a partir del cual regenerar',
    type: PreviousSchemaDto,
    example: {
      tables: [
        {
          name: 'employees',
          columns: [
            { name: 'id', type: 'int', primary: true, foreign: null },
            { name: 'name', type: 'varchar', primary: false, foreign: null },
          ],
        },
      ],
    },
  })
  @ValidateNested()
  @Type(() => PreviousSchemaDto)
  previousSchema!: PreviousSchemaDto;

  @ApiProperty({
    example: 'CREATE TABLE users (...)',
    description: 'SQL anterior que se usará como referencia',
  })
  @IsString()
  @MinLength(1, { message: 'previousSql es requerido' })
  previousSql!: string;

  @ApiPropertyOptional({
    example: 0.5,
    description: 'Nivel de variación entre 0 y 1 (por defecto 0.5)',
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'variationLevel debe ser mayor o igual a 0' })
  @Max(1, { message: 'variationLevel debe ser menor o igual a 1' })
  variationLevel?: number;
}
