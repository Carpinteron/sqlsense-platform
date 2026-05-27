import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChallengeResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'SELECT_BASICO_001' })
  title!: string;

  @ApiProperty({ example: 'Escribe una consulta SQL para...' })
  description!: string;

  @ApiPropertyOptional({ enum: ['Easy', 'Medium', 'Hard'], example: 'Easy' })
  difficulty?: 'Easy' | 'Medium' | 'Hard';

  @ApiPropertyOptional({ type: [String], example: ['select'] })
  tags?: string[];

  @ApiPropertyOptional({ example: 'PostgreSQL' })
  databaseEngine?: string;

  @ApiPropertyOptional({ example: 60 })
  timeLimit?: number;

  @ApiPropertyOptional({ enum: ['draft', 'published', 'archived'], example: 'draft' })
  status?: 'draft' | 'published' | 'archived';

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
  courseId?: string;

  @ApiPropertyOptional({ example: 1 })
  createdBy?: number;

  @ApiPropertyOptional({ example: 'CREATE TABLE ...' })
  schemaSql?: string;

  @ApiPropertyOptional({ example: 'INSERT INTO ...' })
  seedDataSql?: string;

  @ApiPropertyOptional({ example: { rows: [{ id: 1 }] }, nullable: true })
  expectedResult?: object | null;

  @ApiPropertyOptional({ example: '2026-01-01T00:00:00.000Z' })
  createdAt?: Date | string;
}
