import { Evaluation } from '../entities/evaluation.entity';

export interface ChallengeContext {
  schema_sql: string;
  seed_data_sql: string;
  expected_result: any;
}

export interface ISubmissionRepository {
  // Busca la submission en la db 
  findById(id: string): Promise<Evaluation>;

   //Obtiene la configuración del reto 
  getChallengeContext(challengeId: string): Promise<ChallengeContext>;

  // Guarda los resultados finales 
  update(evaluation: Evaluation): Promise<void>;
}