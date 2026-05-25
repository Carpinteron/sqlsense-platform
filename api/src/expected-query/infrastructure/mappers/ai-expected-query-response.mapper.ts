import { Injectable } from '@nestjs/common';
import type { ExpectedQueryResponse } from '../../domain/entities/expected-query.entity';
import { ExpectedQueryParseError } from '../../domain/errors/expected-query-parse.error';

@Injectable()
export class AiExpectedQueryResponseMapper {
  parse(raw: string): ExpectedQueryResponse {
    let sql = raw.trim();

    const codeBlock = sql.match(/```(?:sql)?\s*([\s\S]*?)```/);
    if (codeBlock) {
      sql = codeBlock[1].trim();
    }

    if (!sql) {
      throw new ExpectedQueryParseError(
        'The AI returned an empty response. Please try again.',
      );
    }

    return { expected_sql: sql };
  }
}
