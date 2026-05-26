import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { buildSql } from '../../domain/entities/mock-data.entity';

interface CombineJobData {
  table: string;
  totalRows: number;
}

@Processor('mock-data-combine-queue')
export class MockDataCombineProcessor extends WorkerHost {
  async process(job: Job<CombineJobData>) {
    const { table, totalRows } = job.data;

    console.log(`[MockData Combine] Combinando chunks para job ${job.id}: tabla=${table}, target=${totalRows}`);

    const childrenValues = await job.getChildrenValues() as Record<string, Record<string, unknown>[]>;
    const allData = Object.values(childrenValues).flat();
    const finalData = allData.slice(0, totalRows);

    console.log(`[MockData Combine] Job ${job.id} completado: ${finalData.length}/${allData.length} filas combinadas`);

    return { table, count: finalData.length, sql: buildSql(table, finalData) };
  }
}
