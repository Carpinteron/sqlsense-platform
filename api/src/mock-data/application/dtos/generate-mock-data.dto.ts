import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  Min,
  IsInt,
  IsObject,
} from 'class-validator';
import { FieldSpecDto } from './field-spec.dto';

export class GenerateMockDataDto {
  @ApiProperty({
    example: 'orders',
    description: 'Nombre de la tabla para la cual generar mock data',
  })
  @IsString()
  table!: string;

  @ApiProperty({
    example: 100,
    description: 'Cantidad de filas de datos a generar',
    minimum: 1,
  })
  @IsNumber()
  @IsInt()
  @Min(1, { message: 'rows debe ser un entero mayor a 0' })
  rows!: number;

  @ApiProperty({
    example: {
      customer_id: {
        type: 'foreign_key',
        references: 'customers.id',
      },
      total: {
        type: 'decimal',
        min: 10000,
        max: 5000000,
      },
      created_at: {
        type: 'date',
        from: '2026-01-01',
        to: '2026-12-31',
      },
      status: {
        type: 'enum',
        values: ['PENDING', 'PAID', 'CANCELLED'],
      },
    },
    description: 'Especificación de campos y sus tipos',
    type: 'object',
    additionalProperties: true,
  })
  @IsObject()
  fields!: Record<string, FieldSpecDto>;
}
