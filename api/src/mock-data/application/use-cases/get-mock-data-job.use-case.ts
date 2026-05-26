import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import type { GenerateMockDataResponse } from '../../domain/entities/mock-data.entity';

export interface MockDataJobStatus {
  jobId: string;
  status: 'waiting' | 'active' | 'completed' | 'failed';
  result?: GenerateMockDataResponse;
  error?: string;
}

@Injectable()
export class GetMockDataJobUseCase {
  constructor(
    @InjectQueue('mock-data-queue')
    private readonly singleQueue: Queue,
    @InjectQueue('mock-data-combine-queue')
    private readonly combineQueue: Queue,
  ) {}

  async execute(jobId: string): Promise<MockDataJobStatus> {
    const job =
      (await this.singleQueue.getJob(jobId)) ??
      (await this.combineQueue.getJob(jobId));

    if (!job) {
      throw new NotFoundException(`Job ${jobId} not found`);
    }

    const state = await job.getState();

    if (state === 'completed') {
      return { jobId, status: 'completed', result: job.returnvalue };
    }

    if (state === 'failed') {
      return { jobId, status: 'failed', error: job.failedReason };
    }

    return { jobId, status: state === 'active' ? 'active' : 'waiting' };
  }
}
