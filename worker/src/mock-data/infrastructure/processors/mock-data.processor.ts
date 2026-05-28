import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { MockDataJobDto } from '../../application/dtos/mock-data-job.dto';
import { GenerateMockDataUseCase } from '../../application/use-cases/generate-mock-data.use-case';
import { buildSql } from '../../domain/entities/mock-data.entity';

@Processor('mock-data-queue')
export class MockDataProcessor extends WorkerHost {
  constructor(private readonly generateMockData: GenerateMockDataUseCase) {
    super();
  }

  async process(job: Job<unknown>) {
    const dto = plainToInstance(MockDataJobDto, job.data);

    try {
      await validateOrReject(dto);
    } catch (errors) {
      console.error(`[MockData Worker] Payload inválido para job ${job.id}:`, errors);
      throw new Error('El payload del job no cumple con los requisitos de validación.');
    }

    console.log(`[MockData Worker] Iniciando job ${job.id}: tabla=${dto.table}, rows=${dto.rows}`);

    const { table, data } = await this.generateMockData.execute({
      table: dto.table,
      rows: dto.rows,
      fields: dto.fields,
    });

    console.log(`[MockData Worker] Job ${job.id} completado: ${data.length} filas generadas`);

    return { table, count: data.length, sql: buildSql(table, data) };
  }
}
