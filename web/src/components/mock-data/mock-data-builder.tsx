"use client";

import { useState } from "react";
import { Database, Eye, Flame, Plus, Play, RefreshCw, Table2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGenerateMockData, useMockDataJob } from "@/hooks/use-mock-data";
import type { FieldSpec, FieldSpecType, SchemaTable } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { SqlEditor } from "@/components/shared/sql-editor";

const FIELD_TYPES: FieldSpecType[] = [
  "int",
  "decimal",
  "varchar",
  "date",
  "enum",
  "foreign_key",
  "boolean",
  "text",
];

interface FieldRow {
  name: string;
  spec: FieldSpec;
  primary?: boolean;
}

const defaultField = (): FieldRow => ({
  name: "id",
  spec: { type: "int", min: 1 },
  primary: true,
});

const DEFAULT_EXAMPLE_FIELDS: FieldRow[] = [
  defaultField(),
  { name: "customer_id", spec: { type: "foreign_key", references: "customers.id" } },
  { name: "total", spec: { type: "decimal", min: 10000, max: 5000000 } },
  {
    name: "created_at",
    spec: { type: "date", from: "2026-01-01", to: "2026-12-31" },
  },
  {
    name: "status",
    spec: { type: "enum", values: ["PENDING", "PAID", "CANCELLED"] },
  },
];

function inferTypeFromColumn(columnType: string): FieldSpecType {
  const normalized = columnType.toLowerCase();
  if (normalized.includes("int")) return "int";
  if (normalized.includes("decimal")) {
    return "decimal";
  }
  if (normalized.includes("numeric")) return "decimal";
  if (normalized.includes("float")) return "decimal";
  if (normalized.includes("date") || normalized.includes("time")) return "date";
  if (normalized.includes("bool")) return "boolean";
  return "varchar";
}

function buildFieldSpec(field: FieldRow): FieldSpec {
  const spec: FieldSpec = { type: field.spec.type };

  if (field.spec.type === "foreign_key" && field.spec.references) {
    spec.references = field.spec.references;
  }
  if ((field.spec.type === "int" || field.spec.type === "decimal") && field.spec.min !== undefined) {
    spec.min = field.spec.min;
  }
  if ((field.spec.type === "int" || field.spec.type === "decimal") && field.spec.max !== undefined) {
    spec.max = field.spec.max;
  }
  if (field.spec.type === "date" && field.spec.from) {
    spec.from = field.spec.from;
  }
  if (field.spec.type === "date" && field.spec.to) {
    spec.to = field.spec.to;
  }
  if (field.spec.type === "enum" && field.spec.values?.length) {
    spec.values = field.spec.values;
  }

  return spec;
}

function buildExampleFields(schemaTable?: SchemaTable): FieldRow[] {
  if (!schemaTable) return DEFAULT_EXAMPLE_FIELDS;

  const fields = schemaTable.columns.map((column) => {
    const type = column.foreign ? "foreign_key" : inferTypeFromColumn(column.type);
    const spec: FieldSpec =
      type === "foreign_key"
        ? { type, references: column.foreign ?? undefined }
        : type === "int"
          ? { type, min: 1 }
          : { type };

    return {
      name: column.name,
      spec,
      primary: column.primary,
    } satisfies FieldRow;
  });

  return fields.length ? fields : DEFAULT_EXAMPLE_FIELDS;
}

export function MockDataBuilder({ schemaTables = [] }: { schemaTables?: SchemaTable[] }) {
  const [table, setTable] = useState(schemaTables[0]?.name ?? "orders");
  const [selectedSchemaTable, setSelectedSchemaTable] = useState(schemaTables[0]?.name ?? "");
  const [rows, setRows] = useState(50);
  const [fields, setFields] = useState<FieldRow[]>(DEFAULT_EXAMPLE_FIELDS);
  const [jobId, setJobId] = useState<string | null>(null);

  const generate = useGenerateMockData();
  const { data: job } = useMockDataJob(jobId, !!jobId);

  const selectedSchemaName = selectedSchemaTable || schemaTables[0]?.name || "";
  const selectedSchema = schemaTables.find((schemaTable) => schemaTable.name === selectedSchemaName);

  const addField = (field?: Partial<FieldRow>) => {
    setFields((current) => [
      ...current,
      {
        name: field?.name ?? `field_${current.length + 1}`,
        spec: field?.spec ?? { type: "varchar" },
        primary: field?.primary ?? false,
      },
    ]);
  };

  const addPresetField = (kind: "pk" | "fk" | "decimal" | "date" | "enum" | "text") => {
    if (kind === "pk") {
      addField({ name: "id", spec: { type: "int", min: 1 }, primary: true });
      return;
    }
    if (kind === "fk") {
      addField({ name: "customer_id", spec: { type: "foreign_key", references: "customers.id" } });
      return;
    }
    if (kind === "decimal") {
      addField({ name: "amount", spec: { type: "decimal", min: 10000, max: 5000000 } });
      return;
    }
    if (kind === "date") {
      addField({ name: "created_at", spec: { type: "date", from: "2026-01-01", to: "2026-12-31" } });
      return;
    }
    if (kind === "enum") {
      addField({ name: "status", spec: { type: "enum", values: ["PENDING", "PAID", "CANCELLED"] } });
      return;
    }
    addField({ name: "description", spec: { type: "text" } });
  };

  const importSchemaTable = () => {
    if (!selectedSchema) return;

    setTable(selectedSchema.name);
    setFields(buildExampleFields(selectedSchema));
  };

  const updateField = (
    index: number,
    patch: { name?: string; primary?: boolean; spec?: Partial<FieldSpec> },
  ) => {
    setFields(
      fields.map((f, i) =>
        i === index
          ? {
              ...f,
              ...patch,
              spec: { ...f.spec, ...(patch.spec ?? {}) } as FieldSpec,
            }
          : f,
      ),
    );
  };

  const removeField = (index: number) => {
    setFields((current) => current.filter((_, i) => i !== index));
  };

  const buildPayload = () => ({
    table: table.trim(),
    rows,
    fields: fields.reduce<Record<string, FieldSpec>>((accumulator, field) => {
      const name = field.name.trim();
      if (!name) return accumulator;
      accumulator[name] = buildFieldSpec(field);
      return accumulator;
    }, {}),
  });

  const displayedTable = job?.result?.table ?? table;

  const handleGenerate = async () => {
    const res = await generate.mutateAsync(buildPayload());
    setJobId(res.jobId);
  };

  const progress =
    job?.status === "completed" ? 100 : job?.status === "active" ? 60 : job?.status === "waiting" ? 20 : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="h-4 w-4 text-primary" />
              Seed data por tabla
            </CardTitle>
            <CardDescription>
              Este endpoint encola un job para una sola tabla por solicitud. El payload debe enviar
              `table`, `rows` y un objeto `fields` con las columnas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[1fr_160px]">
              <div className="space-y-2">
                <Label>Tabla destino</Label>
                <Input
                  value={table}
                  onChange={(e) => setTable(e.target.value)}
                  list="tables-list"
                  placeholder="orders"
                />
                <datalist id="tables-list">
                  {schemaTables.map((schemaTable) => (
                    <option key={schemaTable.name} value={schemaTable.name} />
                  ))}
                </datalist>
              </div>
              <div className="space-y-2">
                <Label>Filas</Label>
                <Input
                  type="number"
                  min={1}
                  value={rows}
                  onChange={(e) => {
                    const nextRows = Number(e.target.value);
                    setRows(Number.isFinite(nextRows) && nextRows > 0 ? nextRows : 1);
                  }}
                />
              </div>
            </div>

            <div className="rounded-lg border border-dashed border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
              {schemaTables.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Table2 className="h-4 w-4" />
                    <span>Importa una sola tabla del esquema y ajusta sus columnas sin rehacer todo manualmente.</span>
                  </div>
                  <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-end">
                    <div className="space-y-2">
                      <Label>Tabla del esquema</Label>
                      <Select value={selectedSchemaTable} onValueChange={setSelectedSchemaTable}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una tabla" />
                        </SelectTrigger>
                        <SelectContent>
                          {schemaTables.map((schemaTable) => (
                            <SelectItem key={schemaTable.name} value={schemaTable.name}>
                              {schemaTable.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="button" variant="outline" onClick={importSchemaTable}>
                      Importar columnas
                    </Button>
                  </div>
                  {selectedSchema && (
                    <div className="flex flex-wrap gap-2 text-xs">
                      {selectedSchema.columns.map((column) => (
                        <Badge key={column.name} variant="secondary" className="gap-1">
                          <span className="font-mono">{column.name}</span>
                          {column.primary && <span>PK</span>}
                          {column.foreign && <span>FK</span>}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="font-medium text-foreground">No hay esquema cargado todavía.</div>
                  <div>Empieza con la plantilla rápida o añade columnas manualmente.</div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => addPresetField("pk")}>
                <Plus className="mr-2 h-3.5 w-3.5" />
                PK
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => addPresetField("fk")}>
                <Plus className="mr-2 h-3.5 w-3.5" />
                FK
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => addPresetField("decimal")}>
                <Plus className="mr-2 h-3.5 w-3.5" />
                Decimal
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => addPresetField("date")}>
                <Plus className="mr-2 h-3.5 w-3.5" />
                Fecha
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => addPresetField("enum")}>
                <Plus className="mr-2 h-3.5 w-3.5" />
                Enum
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => addPresetField("text")}>
                <Plus className="mr-2 h-3.5 w-3.5" />
                Texto
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Campos</Label>
                  <p className="text-xs text-muted-foreground">
                    El backend solo acepta un objeto `fields`; aquí armamos esa estructura con una sola tabla.
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => addField()}>
                  + Campo
                </Button>
              </div>
              {fields.map((field, i) => (
                <div
                  key={i}
                  className="space-y-3 rounded-lg border border-border/50 bg-muted/20 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wide">
                        {field.spec.type}
                      </Badge>
                      {field.primary && <Badge className="text-[10px]">PK</Badge>}
                      {field.spec.type === "foreign_key" && <Badge variant="secondary" className="text-[10px]">FK</Badge>}
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeField(i)}>
                      <Trash2 className="mr-2 h-3.5 w-3.5" />
                      Quitar
                    </Button>
                  </div>
                  <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_200px_150px]">
                    <div className="space-y-2">
                      <Label>Nombre de columna</Label>
                      <Input
                        placeholder="customer_id"
                        value={field.name}
                        onChange={(e) => updateField(i, { name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <Select
                        value={field.spec.type}
                        onValueChange={(v) =>
                          updateField(i, { spec: { type: v as FieldSpecType } })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FIELD_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Propiedad</Label>
                      <label className="flex h-10 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm">
                        <input
                          type="checkbox"
                          checked={!!field.primary}
                          onChange={(e) => updateField(i, { primary: e.target.checked })}
                        />
                        Primary key
                      </label>
                    </div>
                  </div>
                  {(field.spec.type === "int" || field.spec.type === "decimal") && (
                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Min</Label>
                        <Input
                          type="number"
                          placeholder="1"
                          value={field.spec.min ?? ""}
                          onChange={(e) =>
                            updateField(i, {
                              spec: {
                                min: e.target.value === "" ? undefined : Number(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Max</Label>
                        <Input
                          type="number"
                          placeholder="1000"
                          value={field.spec.max ?? ""}
                          onChange={(e) =>
                            updateField(i, {
                              spec: {
                                max: e.target.value === "" ? undefined : Number(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                  {field.spec.type === "enum" && (
                    <div className="space-y-2">
                      <Label>Valores separados por coma</Label>
                      <Input
                        placeholder="PENDING, PAID, CANCELLED"
                        value={field.spec.values?.join(", ") ?? ""}
                        onChange={(e) =>
                          updateField(i, {
                            spec: {
                              values: e.target.value.split(",").map((v) => v.trim()).filter(Boolean),
                            },
                          })
                        }
                      />
                    </div>
                  )}
                  {field.spec.type === "foreign_key" && (
                    <div className="space-y-2">
                      <Label>Referencia</Label>
                      <Input
                        placeholder="customers.id"
                        value={field.spec.references ?? ""}
                        onChange={(e) =>
                          updateField(i, { spec: { references: e.target.value } })
                        }
                      />
                    </div>
                  )}
                  {field.spec.type === "date" && (
                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Desde</Label>
                        <Input
                          placeholder="2026-01-01"
                          value={field.spec.from ?? ""}
                          onChange={(e) => updateField(i, { spec: { from: e.target.value } })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Hasta</Label>
                        <Input
                          placeholder="2026-12-31"
                          value={field.spec.to ?? ""}
                          onChange={(e) => updateField(i, { spec: { to: e.target.value } })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Button
                onClick={handleGenerate}
                disabled={generate.isPending ? true : !(table.trim() && fields.length > 0)}
                className="w-full"
              >
                <Play className="mr-2 h-4 w-4" />
                {generate.isPending ? "Encolando job..." : "Encolar generación"}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => setFields(DEFAULT_EXAMPLE_FIELDS)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Cargar ejemplo
              </Button>
            </div>

            {jobId && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Job: {jobId.slice(0, 8)}…</span>
                  <Badge variant="outline">{job?.status ?? "waiting"}</Badge>
                </div>
                <Progress value={progress} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Flame className="h-4 w-4 text-primary" />
              Payload que se enviará
            </CardTitle>
            <CardDescription>
              Este es el JSON exacto que viaja al endpoint. No se envían campos extra como `primary` ni
              opciones internas del formulario.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={JSON.stringify(buildPayload(), null, 2)}
              readOnly
              className="min-h-[280px] font-mono text-xs"
            />
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Eye className="h-4 w-4" />
            Resultado del job
          </CardTitle>
          <CardDescription>
            El backend devuelve `jobId`, estado y, al terminar, el SQL generado con el conteo de filas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
                <div className="text-xs uppercase text-muted-foreground">Estado</div>
                <div className="mt-1 font-medium">{job?.status ?? "waiting"}</div>
              </div>
              <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
                <div className="text-xs uppercase text-muted-foreground">Tabla</div>
                <div className="mt-1 font-medium">{displayedTable ? displayedTable : "-"}</div>
              </div>
              <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
                <div className="text-xs uppercase text-muted-foreground">Filas</div>
                <div className="mt-1 font-medium">{job?.result?.count ?? rows}</div>
              </div>
            </div>

            {job?.status === "failed" ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {job.error}
              </div>
            ) : (
              <SqlEditor
                value={job?.result?.sql ?? "-- El SQL generado aparecerá aquí cuando el job termine"}
                readOnly
                height="420px"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
