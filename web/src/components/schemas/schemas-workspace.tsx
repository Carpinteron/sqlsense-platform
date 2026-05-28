"use client";

import { useState, useRef } from "react";
import { Sparkles, Upload, Table2, RefreshCw } from "lucide-react";
import { useGenerateSchema, useRegenerateSchema } from "@/hooks/use-schemas";
import type { GeneratedSchema } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SqlEditor } from "@/components/shared/sql-editor";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MockDataBuilder } from "@/components/mock-data/mock-data-builder";

export function SchemasWorkspace() {
  const [prompt, setPrompt] = useState(
    "Crea un esquema de e-commerce con tablas customers, orders y products con relaciones foreign key.",
  );
  const [result, setResult] = useState<GeneratedSchema | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const generate = useGenerateSchema();
  const regenerate = useRegenerateSchema();

  const handleGenerate = async () => {
    const data = await generate.mutateAsync(prompt);
    setResult(data);
  };

  const handleRegenerate = async () => {
    if (!result) return;
    const data = await regenerate.mutateAsync({
      prompt,
      previousSchema: result.schema,
      previousSql: result.sql,
      variationLevel: 2,
    });
    setResult(data);
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const sql = String(reader.result ?? "");
      setResult({ schema: { tables: [] }, sql });
    };
    reader.readAsText(file);
  };

  return (
    <Tabs defaultValue="schema" className="space-y-4">
      <TabsList>
        <TabsTrigger value="schema">Esquemas SQL</TabsTrigger>
        <TabsTrigger value="mock">Datos de prueba</TabsTrigger>
      </TabsList>

      <TabsContent value="schema" className="space-y-4">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Generación con IA
            </CardTitle>
            <CardDescription>
              Describe el dominio y genera DDL automáticamente vía API.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleGenerate} disabled={generate.isPending || prompt.length < 10}>
                {generate.isPending ? "Generando..." : "Generar esquema"}
              </Button>
              {result && (
                <Button variant="outline" onClick={handleRegenerate} disabled={regenerate.isPending}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerar variante
                </Button>
              )}
              <Button variant="outline" onClick={() => fileRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Subir .sql
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept=".sql,.txt"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUpload(f);
                }}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="text-base">Editor SQL</CardTitle>
            </CardHeader>
            <CardContent>
              {generate.isPending ? (
                <Skeleton className="h-[320px] w-full" />
              ) : (
                <SqlEditor
                  value={result?.sql ?? "-- Genera o sube un script SQL"}
                  onChange={(sql) => setResult((prev) => (prev ? { ...prev, sql } : { schema: { tables: [] }, sql }))}
                  height="320px"
                />
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Table2 className="h-4 w-4" />
                Vista previa del esquema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[380px] overflow-y-auto">
              {!result?.schema.tables.length ? (
                <p className="text-sm text-muted-foreground">
                  Las tablas detectadas por IA aparecerán aquí.
                </p>
              ) : (
                result.schema.tables.map((table) => (
                  <div
                    key={table.name}
                    className="rounded-lg border border-border/50 overflow-hidden"
                  >
                    <div className="bg-muted/40 px-3 py-2 text-sm font-medium font-mono">
                      {table.name}
                    </div>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border/30 text-muted-foreground">
                          <th className="text-left px-3 py-1.5">Columna</th>
                          <th className="text-left px-3 py-1.5">Tipo</th>
                          <th className="text-left px-3 py-1.5">Flags</th>
                        </tr>
                      </thead>
                      <tbody>
                        {table.columns.map((col) => (
                          <tr key={col.name} className="border-b border-border/20 last:border-0">
                            <td className="px-3 py-1.5 font-mono">{col.name}</td>
                            <td className="px-3 py-1.5 text-muted-foreground">{col.type}</td>
                            <td className="px-3 py-1.5">
                              {col.primary && <Badge variant="outline" className="text-[10px] mr-1">PK</Badge>}
                              {col.foreign && <Badge variant="outline" className="text-[10px]">FK</Badge>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="mock">
        <MockDataBuilder schemaTables={result?.schema.tables} />
      </TabsContent>
    </Tabs>
  );
}
