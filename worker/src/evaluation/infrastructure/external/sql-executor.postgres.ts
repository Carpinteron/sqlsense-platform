import { Injectable } from '@nestjs/common';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import {
  ExecutionContext,
  ISqlExecutor,
  RunnerResponse,
} from '../../domain/interfaces/sql-executor.interface';

type RawRunnerResult = {
  status?: RunnerResponse['status'];
  data?: RunnerResponse['data'];
  error?: string;
  executionTimeMs?: number;
  explainAnalyze?: string;

};

@Injectable()
export class SqlExecutorPostgres implements ISqlExecutor {
  private static readonly _runnerImageTag = 'sqlsense-postgres-runner:latest';
  private static readonly _runnerTimeoutMs = 100_000;
  private static readonly _runnerMemoryLimit = '512m';
  private static readonly _runnerCpuLimit = '0.5';
  private static _isImageReady = false;

  async runInSandbox(context: ExecutionContext): Promise<RunnerResponse> {
    try {
      console.log(
        `[SqlExecutorPostgres] Iniciando sandbox para challengeId=${context.challengeId}`,
      );
      console.log(
        `[SqlExecutorPostgres] Payload recibido: schema=${context.schema.length} chars, seed=${context.seed.length} chars, query=${context.studentQuery.length} chars`,
      );

      await this._ensureRunnerImageBuilt();

      const payload = JSON.stringify(context);
      console.log('[SqlExecutorPostgres] Ejecutando contenedor PostgreSQL temporal...');
      const { stdout, stderr, timedOut } = await this._runCommand(
        'docker',
        [
          'run',
          '--rm',
          '--network',
          'none',
          '--memory',
          SqlExecutorPostgres._runnerMemoryLimit,
          '--cpus',
          SqlExecutorPostgres._runnerCpuLimit,
          '-i',
          SqlExecutorPostgres._runnerImageTag,
        ],
        payload,
        SqlExecutorPostgres._runnerTimeoutMs,
      );

      if (timedOut) {
        console.warn(
          `[SqlExecutorPostgres] Timeout alcanzado para challengeId=${context.challengeId}`,
        );
        return {
          status: 'TIME_LIMIT_EXCEEDED',
          data: null,
          executionTimeMs: SqlExecutorPostgres._runnerTimeoutMs,
          error: 'La ejecución excedió el tiempo límite.',
        };
      }

      const output = stdout.trim();
      if (!output) {
        console.error(
          `[SqlExecutorPostgres] El runner no devolvió stdout. stderr=${stderr || 'sin stderr'}`,
        );
        return {
          status: 'RUNTIME_ERROR',
          data: null,
          executionTimeMs: 0,
          error: stderr || 'El runner no devolvió salida.',
        };
      }

      let parsed: RawRunnerResult;
      try {
        console.log(`[SqlExecutorPostgres] Raw output del runner: ${output}`);
        parsed = JSON.parse(output) as RawRunnerResult;
      } catch {
        console.error('[SqlExecutorPostgres] No se pudo parsear la salida JSON del runner.');
        return {
          status: 'RUNTIME_ERROR',
          data: null,
          executionTimeMs: 0,
          error: `Salida del runner inválida: ${output}`,
        };
      }

      return {
        status: parsed.status ?? 'RUNTIME_ERROR',
        data: parsed.data ?? null,
        error: parsed.error,
        executionTimeMs: parsed.executionTimeMs ?? 0,
        explainAnalyze: parsed.explainAnalyze,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('spawn docker ENOENT')) {
        console.error(
          '[SqlExecutorPostgres] Docker no está disponible en el entorno del worker. Verifica que Docker esté instalado y accesible en PATH.',
        );
      } else {
        console.error('[SqlExecutorPostgres] Error inesperado ejecutando el sandbox:', message);
      }
      return {
        status: 'RUNTIME_ERROR',
        data: null,
        executionTimeMs: 0,
        error: message,
        explainAnalyze: null,
      };
    }
  }

  private async _ensureRunnerImageBuilt(): Promise<void> {
    if (SqlExecutorPostgres._isImageReady) {
      return;
    }

    const runnerDir = resolve(__dirname, '../../../../runners/postgres');
    const dockerFilePath = resolve(runnerDir, 'Dockerfile');

    console.log(`[SqlExecutorPostgres] Construyendo imagen runner: ${SqlExecutorPostgres._runnerImageTag}`);
    console.log(`[SqlExecutorPostgres] runnerDir=${runnerDir}`);

    const { stderr, code } = await this._runCommand(
      'docker',
      ['build', '-t', SqlExecutorPostgres._runnerImageTag, '-f', dockerFilePath, runnerDir],
      undefined,
      120_000,
    );

    if (code !== 0) {
      console.error(
        `[SqlExecutorPostgres] Falló la construcción de la imagen. stderr=${stderr || 'sin stderr'}`,
      );
      throw new Error(`No se pudo construir la imagen del runner PostgreSQL: ${stderr}`);
    }

    console.log('[SqlExecutorPostgres] Imagen runner construida correctamente.');
    SqlExecutorPostgres._isImageReady = true;
  }

  private _runCommand(
    command: string,
    args: string[],
    input?: string,
    timeoutMs = 0,
  ): Promise<{ stdout: string; stderr: string; code: number; timedOut: boolean }> {
    return new Promise((resolvePromise, rejectPromise) => {
      console.log(`[SqlExecutorPostgres] Ejecutando comando: ${command} ${args.join(' ')}`);
      const child = spawn(command, args, {
        stdio: 'pipe',
      });

      let stdout = '';
      let stderr = '';
      let timedOut = false;

      const timeoutHandle =
        timeoutMs > 0
          ? setTimeout(() => {
              timedOut = true;
              child.kill('SIGKILL');
            }, timeoutMs)
          : null;

      child.stdout.on('data', (chunk: Buffer) => {
        stdout += chunk.toString();
      });

      child.stderr.on('data', (chunk: Buffer) => {
        stderr += chunk.toString();
      });

      child.on('error', (error) => {
        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
        }
        console.error(`[SqlExecutorPostgres] Error al lanzar proceso: ${error.message}`);
        rejectPromise(error);
      });

      child.on('close', (code) => {
        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
        }

        resolvePromise({
          stdout,
          stderr,
          code: code ?? 1,
          timedOut,
        });
      });

      if (input) {
        child.stdin.write(input);
      }
      child.stdin.end();
    });
  }
}
