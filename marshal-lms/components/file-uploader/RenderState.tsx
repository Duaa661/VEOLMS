"use client";

import { cn } from "@/lib/utils";
import { ImageIcon, VideoIcon } from "lucide-react";
import { Button } from "../ui/button";

interface RenderEmptyStateProps {
  isDragActive: boolean;
  filetypeAccepted: "image" | "video";
}

export function RenderEmptyState({
  isDragActive,
  filetypeAccepted,
}: RenderEmptyStateProps) {
  const Icon = filetypeAccepted === "image" ? ImageIcon : VideoIcon;

  return (
    <div className="text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
        <Icon
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary"
          )}
        />
      </div>

      <p className="mt-4 text-base font-semibold text-foreground">
        Drop your {filetypeAccepted} here or{" "}
        <span className="cursor-pointer font-bold text-primary">
          Click to Upload
        </span>
      </p>

      <Button type="button" className="mt-4">
        Select {filetypeAccepted === "image" ? "Image" : "Video"}
      </Button>
    </div>
  );
}

interface RenderErrorStateProps {
  filetypeAccepted: "image" | "video";
}

export function RenderErrorState({
  filetypeAccepted,
}: RenderErrorStateProps) {
  const Icon = filetypeAccepted === "image" ? ImageIcon : VideoIcon;

  return (
    <div className="text-center text-destructive">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/30">
        <Icon className="size-6 text-destructive" />
      </div>

      <p className="text-base font-semibold">Upload Failed</p>

      <p className="mt-1 text-sm text-muted-foreground">
        Failed to upload the {filetypeAccepted}.
      </p>

      <p className="mt-3 text-xl text-muted-foreground">
        Click or drop a {filetypeAccepted} to retry.
      </p>

      <Button type="button" className="mt-4">
        Retry {filetypeAccepted === "image" ? "Image" : "Video"} Selection
      </Button>
    </div>
  );
}