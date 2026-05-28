import { Injectable } from '@nestjs/common';
import { InjectQueue, InjectFlowProducer } from '@nestjs/bullmq';
import { Queue, FlowProducer } from 'bullmq';
import type { MockDataSpec } from '../../domain/entities/mock-data.entity';

const CHUNK_SIZE = 100;

@Injectable()
export class EnqueueMockDataUseCase {
  constructor(
    @InjectQueue('mock-data-queue')
    private readonly queue: Queue,
    @InjectFlowProducer('mock-data-flow')
    private readonly flowProducer: FlowProducer,
  ) {}

  async execute(spec: MockDataSpec): Promise<{ jobId: string }> {
    if (spec.rows <= CHUNK_SIZE) {
      const job = await this.queue.add('generate', spec);
      return { jobId: job.id! };
    }

    const chunkCount = Math.ceil(spec.rows / CHUNK_SIZE);
    const chunks = Array.from({ length: chunkCount }, (_, i) => {
      const isLast = i === chunkCount - 1;
      const rows = isLast ? spec.rows - i * CHUNK_SIZE : CHUNK_SIZE;
      return {
        name: `chunk-${i}`,
        queueName: 'mock-data-chunk-queue',
        data: { table: spec.table, rows, fields: spec.fields },
        opts: {
          attempts: 3,
          backoff: { type: 'exponential', delay: 5000 },
          failParentOnFailure: true,
        },
      };
    });

    const flow = await this.flowProducer.add({
      name: 'combine',
      queueName: 'mock-data-combine-queue',
      data: { table: spec.table, totalRows: spec.rows },
      children: chunks,
    });

    return { jobId: flow.job.id! };
  }
}
