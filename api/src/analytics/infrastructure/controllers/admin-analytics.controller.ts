import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { AdminAnalyticsResponseDto } from '../../application/dtos/admin-analytics-response.dto';

@ApiTags('Analytics')
@ApiBearerAuth('JWT')
@Controller('analytics')
export class AdminAnalyticsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('admin-summary')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['ADMIN'])
  @ApiOperation({ summary: 'Resumen global para administración' })
  @ApiResponse({ status: 200, type: AdminAnalyticsResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async getAdminSummary(): Promise<AdminAnalyticsResponseDto> {
    const [
      totalUsers,
      totalCourses,
      totalChallenges,
      totalEvaluations,
      totalSubmissions,
      students,
      professors,
      admins,
      publishedChallenges,
      draftChallenges,
      archivedChallenges,
      queuedSubmissions,
      runningSubmissions,
      acceptedSubmissions,
      wrongAnswerSubmissions,
      syntaxErrorSubmissions,
      timeLimitSubmissions,
      runtimeSubmissions,
      optimizationSubmissions,
      recentUsers,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.course.count(),
      this.prisma.challenges.count(),
      this.prisma.evaluations.count(),
      this.prisma.submissions.count(),
      this.prisma.user.count({ where: { role: 'STUDENT' } }),
      this.prisma.user.count({ where: { role: 'PROFESSOR' } }),
      this.prisma.user.count({ where: { role: 'ADMIN' } }),
      this.prisma.challenges.count({ where: { status: 'published' } }),
      this.prisma.challenges.count({ where: { status: 'draft' } }),
      this.prisma.challenges.count({ where: { status: 'archived' } }),
      this.prisma.submissions.count({ where: { status: 'QUEUED' } }),
      this.prisma.submissions.count({ where: { status: 'RUNNING' } }),
      this.prisma.submissions.count({ where: { status: 'ACCEPTED' } }),
      this.prisma.submissions.count({ where: { status: 'WRONG_ANSWER' } }),
      this.prisma.submissions.count({ where: { status: 'SYNTAX_ERROR' } }),
      this.prisma.submissions.count({ where: { status: 'TIME_LIMIT_EXCEEDED' } }),
      this.prisma.submissions.count({ where: { status: 'RUNTIME_ERROR' } }),
      this.prisma.submissions.count({ where: { status: 'OPTIMIZATION_REQUIRED' } }),
      this.prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, email: true, role: true, createdAt: true },
      }),
    ]);

    return {
      totalUsers,
      totalCourses,
      totalChallenges,
      totalEvaluations,
      totalSubmissions,
      usersByRole: [
        { label: 'STUDENT', count: students },
        { label: 'PROFESSOR', count: professors },
        { label: 'ADMIN', count: admins },
      ],
      challengesByStatus: [
        { label: 'published', count: publishedChallenges },
        { label: 'draft', count: draftChallenges },
        { label: 'archived', count: archivedChallenges },
      ],
      submissionsByStatus: [
        { label: 'QUEUED', count: queuedSubmissions },
        { label: 'RUNNING', count: runningSubmissions },
        { label: 'ACCEPTED', count: acceptedSubmissions },
        { label: 'WRONG_ANSWER', count: wrongAnswerSubmissions },
        { label: 'SYNTAX_ERROR', count: syntaxErrorSubmissions },
        { label: 'TIME_LIMIT_EXCEEDED', count: timeLimitSubmissions },
        { label: 'RUNTIME_ERROR', count: runtimeSubmissions },
        { label: 'OPTIMIZATION_REQUIRED', count: optimizationSubmissions },
      ].filter((item) => item.count > 0),
      recentUsers: recentUsers.map((user) => ({
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt?.toISOString() ?? new Date().toISOString(),
      })),
    };
  }
}