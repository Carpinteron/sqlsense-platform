import { IsString, IsInt, IsObject, Min } from 'class-validator';

export class MockDataJobDto {
  @IsString()
  table!: string;

  @IsInt()
  @Min(1)
  rows!: number;

  @IsObject()
  fields!: Record<string, any>;
}
