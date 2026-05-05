import { IAIAssistant, EvaluationResult } from '../../domain/interfaces/ai-assistant.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AIAssistantStub implements IAIAssistant {
  async evaluate(query: string, expected: any, actual: any): Promise<EvaluationResult> {
    return {
      score: 5,
      feedback: 'Excelente uso de los JOINs y filtros. El resultado coincide perfectamente.'
    };
  }

  async getOptimizationTips(query: string, time: number): Promise<string> {
    return 'Considera agregar un índice en la columna created_at para mejorar el rendimiento.';
  }
}