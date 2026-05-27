"use client";

import { useState } from "react";
import { Database, Play, Eye } from "lucide-react";
import { useGenerateMockData, useMockDataJob } from "@/hooks/use-mock-data";
import type { FieldSpec, FieldSpecType, SchemaTable } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { SqlEditor } from "@/components/shared/sql-editor";
import { Badge } from "@/components/ui/badge";

const FIELD_TYPES: FieldSpecType[] = [
  "int", "decimal", "varchar", "date", "enum", "foreign_key", "boolean", "text",
];

interface FieldRow {
  name: string;
  spec: FieldSpec;
}

const defaultField = (): FieldRow => ({
  name: "id",
  spec: { type: "int", min: 1, max: 1000 },
});

export function MockDataBuilder({ schemaTables = [] }: { schemaTables?: SchemaTable[] }) {
  const [table, setTable] = useState(schemaTables[0]?.name ?? "orders");
  const [rows, setRows] = useState(50);
  const [fields, setFields] = useState<FieldRow[]>([
    defaultField(),
    { name: "total", spec: { type: "decimal", min: 100, max: 5000 } },
    {
      name: "status",
      spec: { type: "enum", values: ["PENDING", "PAID", "CANCELLED"] },
    },
  ]);
  const [nullPercent, setNullPercent] = useState(5);
  const [edgeCases, setEdgeCases] = useState(true);
  const [jobId, setJobId] = useState<string | null>(null);

  const generate = useGenerateMockData();
  const { data: job } = useMockDataJob(jobId, !!jobId);

  const addField = () => setFields([...fields, { name: `field_${fields.length + 1}`, spec: { type: "varchar" } }]);

  const updateField = (
    index: number,
    patch: { name?: string; spec?: Partial<FieldSpec> },
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

  const buildPayload = () => {
    const fieldMap: Record<string, FieldSpec> = {};
    fields.forEach(({ name, spec }) => {
      fieldMap[name] = {
        ...spec,
        ...(nullPercent > 0 && { nullPercent }),
        ...(edgeCases && spec.type === "int" ? { edgeCases: ["0", "-1", "999999"] } : {}),
      };
    });
    return {
      table,
      rows,
      fields: fieldMap,
    };
  };

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
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              Configuración del dataset
            </CardTitle>
            <CardDescription>
              Define tabla, filas, tipos, rangos, enums y relaciones FK.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Tabla</Label>
                <Input value={table} onChange={(e) => setTable(e.target.value)} list="tables-list" />
                <datalist id="tables-list">
                  {schemaTables.map((t) => (
                    <option key={t.name} value={t.name} />
                  ))}
                </datalist>
              </div>
              <div className="space-y-2">
                <Label>Filas</Label>
                <Input type="number" min={1} value={rows} onChange={(e) => setRows(Number(e.target.value))} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>% valores NULL</Label>
                <Input type="number" min={0} max={100} value={nullPercent} onChange={(e) => setNullPercent(Number(e.target.value))} />
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={edgeCases} onChange={(e) => setEdgeCases(e.target.checked)} />
                  Incluir edge cases
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Campos</Label>
                <Button type="button" variant="outline" size="sm" onClick={addField}>
                  + Campo
                </Button>
              </div>
              {fields.map((field, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border/50 p-3 space-y-2 bg-muted/20"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="nombre"
                      value={field.name}
                      onChange={(e) => updateField(i, { name: e.target.value })}
                    />
                    <Select
                      value={field.spec.type}
                      onValueChange={(v) =>
                        updateField(i, { spec: { type: v as FieldSpecType } })
                      }
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {FIELD_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {(field.spec.type === "int" || field.spec.type === "decimal") && (
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="min"
                        value={field.spec.min ?? ""}
                        onChange={(e) =>
                          updateField(i, { spec: { min: Number(e.target.value) } })
                        }
                      />
                      <Input
                        type="number"
                        placeholder="max"
                        value={field.spec.max ?? ""}
                        onChange={(e) =>
                          updateField(i, { spec: { max: Number(e.target.value) } })
                        }
                      />
                    </div>
                  )}
                  {field.spec.type === "enum" && (
                    <Input
                      placeholder="VAL1, VAL2, VAL3"
                      value={field.spec.values?.join(", ") ?? ""}
                      onChange={(e) =>
                        updateField(i, {
                          spec: {
                            values: e.target.value.split(",").map((v) => v.trim()).filter(Boolean),
                          },
                        })
                      }
                    />
                  )}
                  {field.spec.type === "foreign_key" && (
                    <Input
                      placeholder="customers.id"
                      value={field.spec.references ?? ""}
                      onChange={(e) =>
                        updateField(i, { spec: { references: e.target.value } })
                      }
                    />
                  )}
                  {field.spec.type === "date" && (
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="from"
                        value={field.spec.from ?? ""}
                        onChange={(e) => updateField(i, { spec: { from: e.target.value } })}
                      />
                      <Input
                        placeholder="to"
                        value={field.spec.to ?? ""}
                        onChange={(e) => updateField(i, { spec: { to: e.target.value } })}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Button onClick={handleGenerate} disabled={generate.isPending} className="w-full">
              <Play className="mr-2 h-4 w-4" />
              Generar mock data
            </Button>

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
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Vista previa SQL
          </CardTitle>
          <CardDescription>
            Resultado del job asíncrono ({job?.result?.count ?? 0} filas).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {job?.status === "failed" ? (
            <p className="text-sm text-destructive">{job.error}</p>
          ) : (
            <SqlEditor
              value={job?.result?.sql ?? "-- El SQL generado aparecerá aquí"}
              readOnly
              height="480px"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
