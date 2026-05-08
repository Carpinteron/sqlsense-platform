import { ApiProperty } from '@nestjs/swagger';

export class AuthHealthResponseDto {
  @ApiProperty({ example: 'up' })
  status!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  timestamp!: string;

  @ApiProperty({ example: 'connected' })
  redis!: string;
}
