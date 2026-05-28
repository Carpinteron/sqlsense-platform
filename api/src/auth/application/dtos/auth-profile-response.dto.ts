import { ApiProperty } from '@nestjs/swagger';

export class AuthProfileUserDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'admin@sqlsense.com' })
  email!: string;

  @ApiProperty({ example: 'ADMIN', enum: ['ADMIN', 'PROFESSOR', 'STUDENT'] })
  role!: string;
}

export class AuthProfileResponseDto {
  @ApiProperty({ example: 'Este es un endpoint protegido' })
  message!: string;

  @ApiProperty({
    type: AuthProfileUserDto,
    example: { id: 1, email: 'admin@sqlsense.com', role: 'ADMIN' },
  })
  user!: AuthProfileUserDto;
}
