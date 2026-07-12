"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { constructObjectUrl } from "@/hooks/use-construct-url";

import { Card, CardContent } from "../ui/card";
import { RenderEmptyState, RenderErrorState } from "./RenderState";

interface UploadState {
  file: File | null;
  objectUrl?: string;
  key?: string;
  uploading: boolean;
  progress: number;
  error: boolean;
  isDeleting: boolean;
}

interface isAppProps {
  value?: string;
  onChange?: (value: string) => void;
  filetypeAccepted: "image" | "video";
}

export function Uploader({ onChange, value, filetypeAccepted }: isAppProps) {
  const fileUrl = value ? constructObjectUrl(value) : "";

const [state, setState] = useState<UploadState>(() => ({
  file: null,
  objectUrl: fileUrl,
  key: value,
  uploading: false,
  progress: 0,
  error: false,
  isDeleting: false,
}));
  
  useEffect(() => {
    return () => {
      if (state.objectUrl && !state.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(state.objectUrl);
      }
    };
  }, [state.objectUrl]);

  const handleRemoveFile = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (state.isDeleting) return;

      try {
        setState((prev) => ({
          ...prev,
          isDeleting: true,
        }));

        if (state.key) {
          const response = await fetch("/api/s3/delete", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              key: state.key,
            }),
          });

          const data = await response.json();

          if (!response.ok || !data.success) {
            throw new Error(
              data.message || "Failed to remove file from storage.",
            );
          }
        }

        if (state.objectUrl && !state.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(state.objectUrl);
        }

        onChange?.("");

        setState({
          file: null,
          objectUrl: "",
          key: undefined,
          uploading: false,
          progress: 0,
          error: false,
          isDeleting: false,
        });

        toast.success("File deleted successfully.");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete file.",
        );

        setState((prev) => ({
          ...prev,
          isDeleting: false,
        }));
      }
    },
    [state, onChange],
  );

  const uploadFile = useCallback(
    async (file: File) => {
      try {
        setState((prev) => ({
          ...prev,
          uploading: true,
          progress: 0,
          error: false,
        }));

        const res = await fetch("/api/s3/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            size: file.size,
            isImage: filetypeAccepted === "image",
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to generate upload URL.");
        }

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.open("PUT", data.uploadUrl);
          xhr.setRequestHeader("Content-Type", file.type);

          xhr.upload.onprogress = (event) => {
            if (!event.lengthComputable) return;

            setState((prev) => ({
              ...prev,
              progress: Math.round((event.loaded / event.total) * 100),
            }));
          };

          xhr.onload = () => {
            if (xhr.status === 200) {
              resolve();
            } else {
              reject(new Error(`Upload failed (${xhr.status})`));
            }
          };

          xhr.onerror = () => reject(new Error("Network error."));
          xhr.onabort = () => reject(new Error("Upload aborted."));

          xhr.send(file);
        });

        setState((prev) => ({
          ...prev,
          uploading: false,
          progress: 100,
          key: data.key,
        }));

        onChange?.(data.key);

        toast.success("File uploaded successfully.");
      } catch (error) {
        setState((prev) => ({
          ...prev,
          uploading: false,
          error: true,
        }));

        toast.error(
          error instanceof Error ? error.message : "File upload failed.",
        );
      }
    },
    [filetypeAccepted, onChange],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (!file) return;

      if (state.objectUrl && !state.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(state.objectUrl);
      }

      const objectUrl = URL.createObjectURL(file);

      setState({
        file,
        objectUrl,
        key: undefined,
        uploading: false,
        progress: 0,
        error: false,
        isDeleting: false,
      });

      uploadFile(file);
    },
    [state.objectUrl, uploadFile],
  );

  const onDropRejected = useCallback(
    (rejections: FileRejection[]) => {
      const error = rejections[0]?.errors[0];

      if (!error) return;

      switch (error.code) {
        case "too-many-files":
          toast.error("Only one file can be uploaded.");
          break;

        case "file-too-large":
          toast.error("Maximum file size is 5 MB.");
          break;

        case "file-invalid-type":
          toast.error(
            filetypeAccepted === "image"
              ? "Only image files are allowed."
              : "Only video files are allowed.",
          );
          break;

        default:
          toast.error(error.message);
      }
    },
    [filetypeAccepted],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    multiple: false,
    maxFiles: 1,
    maxSize: filetypeAccepted==="image"?5*1024*1024 :5000*1024*1024,
    accept:
      filetypeAccepted === "image"
        ? {
            "image/*": [],
          }
        : {
            "video/*": [],
          },
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative h-64 w-full cursor-pointer overflow-hidden border-2 border-dashed transition-colors",
        isDragActive
          ? "border-primary bg-primary/10"
          : "border-muted-foreground/30 hover:border-primary",
      )}
    >
      <CardContent className="relative flex h-full items-center justify-center p-4">
        <input {...getInputProps()} />

        {(state.objectUrl || state.uploading) && (
          <button
            type="button"
            onClick={handleRemoveFile}
            disabled={state.isDeleting}
            className="absolute right-3 top-3 z-20 rounded-full bg-black/70 p-1 text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {state.isDeleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <X className="size-4" />
            )}
          </button>
        )}

        {state.uploading ? (
          <div className="space-y-3 text-center">
            <p className="font-medium">Uploading...</p>

            <div className="h-2 w-56 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{
                  width: `${state.progress}%`,
                }}
              />
            </div>

            <p className="text-sm text-muted-foreground">{state.progress}%</p>
          </div>
        ) : state.error ? (
          <RenderErrorState filetypeAccepted={filetypeAccepted} />
        ) : state.objectUrl ? (
          <div className="relative h-full w-full">
            {filetypeAccepted === "image" ? (
              <Image
                src={state.objectUrl}
                alt="Preview"
                fill
                unoptimized
                className="rounded-lg object-cover"
              />
            ) : (
              <video
                src={state.objectUrl}
                controls
                className="h-full w-full rounded-lg object-cover"
              />
            )}
          </div>
        ) : (
          <RenderEmptyState
            isDragActive={isDragActive}
            filetypeAccepted={filetypeAccepted}
          />
        )}
      </CardContent>
    </Card>
  );
}
