import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh token emitido en login o refresh anterior',
  })
  @IsString()
  @IsNotEmpty({ message: 'Refresh token is required' })
  refresh_token!: string;
}
