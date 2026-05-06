export interface FieldSpec {
  type: string;
  references?: string; // foreign_key: "table.column"
  min?: number;        // decimal | int
  max?: number;        // decimal | int
  from?: string;       // date: ISO string
  to?: string;         // date: ISO string
  values?: string[];   // enum
}

export interface MockDataSpec {
  table: string;
  rows: number;
  fields: Record<string, FieldSpec>;
}

export interface GenerateMockDataResponse {
  table: string;
  sql: string;
}

export interface AiMockDataRaw {
  table: string;
  data: Record<string, unknown>[];
}
