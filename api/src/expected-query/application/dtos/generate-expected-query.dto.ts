import { IsObject, IsString, MinLength } from 'class-validator';

export class GenerateExpectedQueryDto {
  @IsString()
  @MinLength(5, { message: 'prompt debe tener al menos 5 caracteres' })
  prompt!: string;

  @IsObject()
  schema!: object;
}
