import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { MockDataJobDto } from '../../application/dtos/mock-data-job.dto';
import { GenerateMockDataUseCase } from '../../application/use-cases/generate-mock-data.use-case';

@Processor('mock-data-chunk-queue', { concurrency: 1 })
export class MockDataChunkProcessor extends WorkerHost {
  constructor(private readonly generateMockData: GenerateMockDataUseCase) {
    super();
  }

  async process(job: Job<unknown>) {
    const dto = plainToInstance(MockDataJobDto, job.data);

    try {
      await validateOrReject(dto);
    } catch (errors) {
      console.error(`[MockData Chunk] Payload inválido para job ${job.id}:`, errors);
      throw new Error('El payload del chunk no cumple con los requisitos de validación.');
    }

    console.log(`[MockData Chunk] Iniciando chunk ${job.id}: tabla=${dto.table}, rows=${dto.rows}`);

    const { data } = await this.generateMockData.execute({
      table: dto.table,
      rows: dto.rows,
      fields: dto.fields,
    });

    console.log(`[MockData Chunk] Chunk ${job.id} completado: ${data.length} filas`);

    return data;
  }
}
