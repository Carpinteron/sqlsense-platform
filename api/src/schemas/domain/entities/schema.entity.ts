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
