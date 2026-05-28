import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GenerateExpectedQueryUseCase } from '../../../expected-query/application/use-cases/generate-expected-query.use-case';
import type { Challenge } from '../../domain/entities/challege.entity';
import { CreateChallengeDto } from '../dtos/create-challege.dto';
import { CrearChallengeUseCase } from './crear-challege.use-case';

type ChallengeSchema = {
  tables: Array<{
    name: string;
    columns: Array<{
      name: string;
      type: string;
      primary: boolean;
      foreign: string | null;
    }>;
  }>;
};

@Injectable()
export class CreateChallengeWithExpectedQueryUseCase {
  constructor(
    private readonly generateExpectedQueryUseCase: GenerateExpectedQueryUseCase,
    private readonly crearChallengeUseCase: CrearChallengeUseCase,
  ) {}

  async execute(dto: CreateChallengeDto, createdBy: number): Promise<Challenge> {
    if (!dto.schemaSql?.trim()) {
      throw new BadRequestException('schemaSql is required to generate the expected query');
    }

    const schema = this.parseSchemaSql(dto.schemaSql.trim());
    const generated = await this.generateExpectedQueryUseCase.execute(
      dto.description.trim(),
      schema,
    );

    const challengeData: Omit<Challenge, 'id' | 'createdAt'> = {
      title: dto.title,
      description: dto.description,
      difficulty: dto.difficulty,
      tags: dto.tags,
      databaseEngine: dto.databaseEngine,
      timeLimit: dto.timeLimit,
      status: dto.status ?? 'draft',
      courseId: dto.courseId,
      createdBy,
      schemaSql: dto.schemaSql,
      seedDataSql: dto.seedDataSql,
      expectedResult: generated.expected_sql.trim(),
    };

    return this.crearChallengeUseCase.execute(challengeData);
  }

  private parseSchemaSql(schemaSql: string): ChallengeSchema {
    const statements = schemaSql
      .split(';')
      .map((statement) => statement.trim())
      .filter(Boolean);

    const tables = statements
      .map((statement) => this.parseCreateTableStatement(statement))
      .filter((table): table is ChallengeSchema['tables'][number] => table !== null);

    if (!tables.length) {
      throw new BadRequestException('schemaSql must contain at least one CREATE TABLE statement');
    }

    return { tables };
  }

  private parseCreateTableStatement(statement: string) {
    const match = statement.match(/^CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(["\w.]+)\s*\((.*)\)$/is);

    if (!match) {
      throw new BadRequestException('schemaSql must contain valid CREATE TABLE statements');
    }

    const tableName = match[1].replace(/"/g, '');
    const columnDefinitions = this.splitDefinitions(match[2]);
    const columns = columnDefinitions
      .map((definition) => this.parseColumnDefinition(definition))
      .filter(
        (column): column is {
          name: string;
          type: string;
          primary: boolean;
          foreign: string | null;
        } => column !== null,
      );

    if (!columns.length) {
      throw new BadRequestException(`schemaSql table "${tableName}" must define at least one column`);
    }

    return {
      name: tableName,
      columns,
    };
  }

  private splitDefinitions(definitions: string): string[] {
    const parts: string[] = [];
    let current = '';
    let depth = 0;

    for (const character of definitions) {
      if (character === '(') {
        depth += 1;
      }

      if (character === ')') {
        depth = Math.max(0, depth - 1);
      }

      if (character === ',' && depth === 0) {
        const trimmed = current.trim();
        if (trimmed) parts.push(trimmed);
        current = '';
        continue;
      }

      current += character;
    }

    const tail = current.trim();
    if (tail) parts.push(tail);

    return parts;
  }

  private parseColumnDefinition(definition: string) {
    const normalized = definition.trim().replace(/\s+/g, ' ');
    const upper = normalized.toUpperCase();

    if (
      upper.startsWith('PRIMARY KEY') ||
      upper.startsWith('FOREIGN KEY') ||
      upper.startsWith('CONSTRAINT ')
    ) {
      return null;
    }

    const columnMatch = normalized.match(/^(["\w]+)\s+(.+)$/);

    if (!columnMatch) {
      return null;
    }

    const name = columnMatch[1].replace(/"/g, '');
    const rest = columnMatch[2];
    const primary = /PRIMARY KEY/i.test(rest);
    const referencesMatch = rest.match(/REFERENCES\s+(["\w.]+)(?:\s*\(([^)]+)\))?/i);

    let type = rest
      .replace(/PRIMARY KEY/i, '')
      .replace(/REFERENCES\s+["\w.]+(?:\s*\([^)]+\))?/i, '')
      .replace(/NOT NULL/i, '')
      .replace(/UNIQUE/i, '')
      .trim();

    if (!type) {
      type = 'text';
    }

    const foreign = referencesMatch
      ? `${referencesMatch[1].replace(/"/g, '')}${referencesMatch[2] ? `.${referencesMatch[2].replace(/"/g, '').trim()}` : ''}`
      : null;

    return {
      name,
      type: type.toLowerCase(),
      primary,
      foreign,
    };
  }
}