"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <Skeleton className="h-full min-h-[200px] w-full rounded-lg" />,
});

interface SqlEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string;
  className?: string;
}

export function SqlEditor({
  value,
  onChange,
  readOnly = false,
  height = "320px",
  className,
}: SqlEditorProps) {
  return (
    <div className={className}>
      <div className="rounded-lg border border-border/50 overflow-hidden ring-1 ring-border/30">
        <MonacoEditor
          height={height}
          language="sql"
          theme="vs-dark"
          value={value}
          onChange={(v) => onChange?.(v ?? "")}
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            padding: { top: 12 },
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}
