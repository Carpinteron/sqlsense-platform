import { IAIAssistant, EvaluationResult } from '../../domain/interfaces/ai-assistant.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AIAssistantStub implements IAIAssistant {
  async evaluate(
    query: string, 
    expectedResult: any, 
    actualResult: any, 
    error?: string
  ): Promise<EvaluationResult> {
    return {
      score: 5,
      feedback: 'Excelente uso de los JOINs y filtros. El resultado coincide perfectamente.',
      requiresOptimization: false
    };
  }

  async getOptimizationTips(query: string, executionTimeMs: number): Promise<string> {
    return 'Considera agregar un índice en la columna de búsqueda para mejorar el rendimiento de la consulta.';
  }
}