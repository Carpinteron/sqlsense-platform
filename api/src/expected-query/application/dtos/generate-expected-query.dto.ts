import { IsObject, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateExpectedQueryDto {
  @IsString()
  @MinLength(5, { message: 'prompt debe tener al menos 5 caracteres' })
  @ApiProperty({ example: 'SELECT * FROM users WHERE id = ?', minLength: 5, description: 'Prompt que describe la consulta esperada' })
  prompt!: string;

  @IsObject()
  @ApiProperty({ type: Object, example: { tables: [{ name: 'users', columns: [{ name: 'id', type: 'int' }] }] }, description: 'Objeto que describe el esquema de la base de datos' })
  schema!: object;
}
