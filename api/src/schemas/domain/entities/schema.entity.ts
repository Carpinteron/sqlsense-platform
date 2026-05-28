export interface SchemaColumn {
  name: string;
  type: string;
  primary: boolean;
  foreign: string | null;
}

export interface SchemaTable {
  name: string;
  columns: SchemaColumn[];
}

export interface GenerateSchemaResponse {
  schema: {
    tables: SchemaTable[];
  };
  sql: string;
}

export interface RegenerateSchemaInput {
  prompt: string;
  previousSchema: { tables: SchemaTable[] };
  previousSql: string;
  variationLevel?: number; // 0.0–1.0, defaults to 0.5
}
