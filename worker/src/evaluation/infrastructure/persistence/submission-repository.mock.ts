import { Injectable } from '@nestjs/common';
import { ISubmissionRepository, ChallengeContext } from '../../domain/interfaces/submission-repository.interface';
import { Evaluation } from '../../domain/entities/evaluation.entity';

@Injectable()
export class SubmissionRepositoryMock implements ISubmissionRepository {
  
  async findById(id: string): Promise<Evaluation> {
    console.log(`[Mock Postgres] Buscando datos de la entrega: ${id}`);
    
    return new Evaluation(
      id,
      'student-uuid-456',
      'challenge-uuid-789',
      'SELECT name FROM users WHERE id = 1;'
    );
  }

  async getChallengeContext(challengeId: string): Promise<ChallengeContext> {
    console.log(`[Mock Postgres] Buscando reglas del reto: ${challengeId}`);
    
    return {
      schema_sql: 'CREATE TABLE users (id SERIAL, name TEXT, active BOOLEAN);',
      seed_data_sql: 'INSERT INTO users (name, active) VALUES ("Jose", true);',
      expected_result: [{ id: 1, name: "Jose", active: true }]
    };
  }

  async update(evaluation: Evaluation): Promise<void> {
    console.log(`[Mock Postgres] GUARDADO EXITOSO: Score ${evaluation.score}/5`);
  }
}