import { ApiProperty} from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class AddStudentDto {
    @ApiProperty({ example: 2 })
    @IsInt()
    studentId!: number;
}
