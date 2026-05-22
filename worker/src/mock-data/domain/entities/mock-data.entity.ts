export interface FieldSpec {
  type: string;
  references?: string;
  min?: number;
  max?: number;
  from?: string;
  to?: string;
  values?: string[];
}

export interface MockDataSpec {
  table: string;
  rows: number;
  fields: Record<string, FieldSpec>;
}

export interface GenerateMockDataResponse {
  table: string;
  count: number;
  sql: string;
}

export interface ChunkResult {
  table: string;
  data: Record<string, unknown>[];
}

export function buildSql(table: string, data: Record<string, unknown>[]): string {
  if (data.length === 0) return '';
  const columns = Object.keys(data[0]);
  const values = data.map(row => {
    const vals = columns.map(col => {
      const v = row[col];
      if (v === null || v === undefined) return 'NULL';
      if (typeof v === 'string') return `'${(v as string).replace(/'/g, "''")}'`;
      return String(v);
    });
    return `(${vals.join(', ')})`;
  });
  return `INSERT INTO ${table} (${columns.join(', ')}) VALUES\n${values.join(',\n')};`;
}

export function validateRow(row: Record<string, unknown>, fields: Record<string, FieldSpec>): boolean {
  for (const [name, spec] of Object.entries(fields)) {
    const value = row[name];
    if (value === undefined || value === null) return false;

    switch (spec.type) {
      case 'int':
        if (typeof value !== 'number' || !Number.isInteger(value)) return false;
        if (spec.min !== undefined && (value as number) < spec.min) return false;
        if (spec.max !== undefined && (value as number) > spec.max) return false;
        break;
      case 'decimal':
        if (typeof value !== 'number') return false;
        if (spec.min !== undefined && (value as number) < spec.min) return false;
        if (spec.max !== undefined && (value as number) > spec.max) return false;
        break;
      case 'enum':
        if (!Array.isArray(spec.values) || !spec.values.includes(value as string)) return false;
        break;
      case 'date':
        if (typeof value !== 'string' || isNaN(Date.parse(value as string))) return false;
        break;
      case 'boolean':
        if (typeof value !== 'boolean') return false;
        break;
      case 'foreign_key':
        if (typeof value !== 'number' || !Number.isInteger(value) || (value as number) < 1) return false;
        break;
      case 'string':
      case 'varchar':
      case 'text':
        if (typeof value !== 'string' || (value as string).trim() === '') return false;
        break;
      case 'uuid':
        if (typeof value !== 'string') return false;
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value as string)) return false;
        break;
    }
  }
  return true;
}
