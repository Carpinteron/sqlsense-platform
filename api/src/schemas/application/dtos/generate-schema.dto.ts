import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class GenerateSchemaDto {
  @ApiProperty({
    example: 'halla la persona menor en la base de datos de una empresa',
    description: 'Descripción natural del schema a generar',
    minLength: 10,
  })
  @IsString()
  @MinLength(10, { message: 'prompt debe tener al menos 10 caracteres' })
  prompt!: string;
}
