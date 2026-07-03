import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";
import { Button } from "../ui/button";

export function RenderEmptyState({
  isDragActive,
}: {
  isDragActive: boolean;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
        <ImageIcon
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary"
          )}
        />
      </div>

      <p className="mt-4 text-base font-semibold text-foreground">
        Drop your files here or{" "}
        <span className="cursor-pointer font-bold text-primary">
          Click to Upload
        </span>
      </p>

      <Button className="mt-4">Select File</Button>
    </div>
  );
}

export function RenderErrorState() {
  return (
    <div className="text-center text-destructive">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/30">
        <ImageIcon className="size-6 text-destructive" />
      </div>

      <p className="text-base font-semibold">Upload Failed</p>

      <p className="mt-1 text-sm text-muted-foreground">
        Something went wrong.
          </p>
          <p className="text-xl mt-3 text-muted-foreground">
              Click or drop file to retry
          </p>
          <Button type="button" className="mt-4">Retry file Selection</Button>
    </div>
  );
}