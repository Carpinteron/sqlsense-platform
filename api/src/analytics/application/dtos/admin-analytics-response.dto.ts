import { ApiProperty } from '@nestjs/swagger';

class CountByLabelDto {
  @ApiProperty({ example: 'STUDENT' })
  label!: string;

  @ApiProperty({ example: 12 })
  count!: number;
}

class RecentUserDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'admin@sqlsense.com' })
  email!: string;

  @ApiProperty({ example: 'ADMIN' })
  role!: string;

  @ApiProperty({ example: '2026-05-27T00:00:00.000Z' })
  createdAt!: string;
}

export class AdminAnalyticsResponseDto {
  @ApiProperty({ example: 42 })
  totalUsers!: number;

  @ApiProperty({ example: 6 })
  totalCourses!: number;

  @ApiProperty({ example: 14 })
  totalChallenges!: number;

  @ApiProperty({ example: 5 })
  totalEvaluations!: number;

  @ApiProperty({ example: 128 })
  totalSubmissions!: number;

  @ApiProperty({ type: [CountByLabelDto] })
  usersByRole!: CountByLabelDto[];

  @ApiProperty({ type: [CountByLabelDto] })
  challengesByStatus!: CountByLabelDto[];

  @ApiProperty({ type: [CountByLabelDto] })
  submissionsByStatus!: CountByLabelDto[];

  @ApiProperty({ type: [RecentUserDto] })
  recentUsers!: RecentUserDto[];
}