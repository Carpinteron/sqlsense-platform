import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number
  className?: string
}

export function Loader({ size = 24, className, ...props }: LoaderProps) {
  return (
    <div
      role="status"
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <Loader2
        className="animate-spin text-muted-foreground"
        size={size}
      />
      <span className="sr-only">Cargando...</span>
    </div>
  )
}
