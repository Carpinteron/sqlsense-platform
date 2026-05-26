import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { GenerateExpectedQueryUseCase } from '../../application/use-cases/generate-expected-query.use-case';
import { GenerateExpectedQueryDto } from '../../application/dtos/generate-expected-query.dto';
import { ExpectedQueryParseError } from '../../domain/errors/expected-query-parse.error';

@Controller('expected-query')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
export class ExpectedQueryController {
  constructor(
    private readonly generateExpectedQuery: GenerateExpectedQueryUseCase,
  ) {}

  @Post('generate')
  async generate(@Body() body: GenerateExpectedQueryDto) {
    if (!body?.prompt?.trim()) {
      throw new BadRequestException('prompt is required');
    }
    if (!body?.schema || typeof body.schema !== 'object') {
      throw new BadRequestException('schema is required and must be an object');
    }
    try {
      return await this.generateExpectedQuery.execute(body.prompt.trim(), body.schema);
    } catch (err) {
      if (err instanceof ExpectedQueryParseError) throw new BadRequestException(err.message);
      throw err;
    }
  }
}
