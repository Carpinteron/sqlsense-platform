import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SchemaColumnDto {
  @ApiProperty({ example: 'id', description: 'Nombre de la columna' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'int', description: 'Tipo de datos SQL' })
  @IsString()
  type!: string;

  @ApiProperty({ example: true, description: 'Indica si es clave primaria' })
  @IsBoolean()
  primary!: boolean;

  @ApiProperty({
    example: null,
    description: 'Referencia a otra tabla (clave foránea)',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  foreign?: string | null;
}

export class SchemaTableDto {
  @ApiProperty({ example: 'users', description: 'Nombre de la tabla' })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Columnas de la tabla',
    type: [SchemaColumnDto],
    example: [
      { name: 'id', type: 'int', primary: true, foreign: null },
      { name: 'name', type: 'varchar', primary: false, foreign: null },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SchemaColumnDto)
  columns!: SchemaColumnDto[];
}

export class PreviousSchemaDto {
  @ApiProperty({
    description: 'Tablas del schema anterior',
    type: [SchemaTableDto],
    example: [
      {
        name: 'users',
        columns: [
          { name: 'id', type: 'int', primary: true, foreign: null },
          { name: 'email', type: 'varchar', primary: false, foreign: null },
        ],
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SchemaTableDto)
  tables!: SchemaTableDto[];
}
