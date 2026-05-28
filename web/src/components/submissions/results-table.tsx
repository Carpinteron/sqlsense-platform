"use client";

import { parseSubmissionResult } from "@/lib/submission-utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { Table2 } from "lucide-react";

export function ResultsTable({ result }: { result: unknown }) {
  const { rows, columns } = parseSubmissionResult(result);

  if (!rows.length) {
    return (
      <EmptyState
        icon={Table2}
        title="Sin filas de resultado"
        description="La ejecución no devolvió datos tabulares o aún está en proceso."
        className="py-8"
      />
    );
  }

  return (
    <div className="rounded-lg border border-border/50 overflow-auto max-h-[280px]">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            {columns.map((col) => (
              <TableHead key={col} className="text-xs font-mono whitespace-nowrap">
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.slice(0, 100).map((row, i) => (
            <TableRow key={i}>
              {columns.map((col) => (
                <TableCell key={col} className="text-xs font-mono">
                  {String(row[col] ?? "")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {rows.length > 100 && (
        <p className="text-xs text-muted-foreground p-2 border-t border-border/30">
          Mostrando 100 de {rows.length} filas
        </p>
      )}
    </div>
  );
}
