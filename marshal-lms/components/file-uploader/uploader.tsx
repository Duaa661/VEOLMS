"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { RenderEmptyState, RenderErrorState } from "./RenderState";

interface UploadState {
  file: File | null;
  objectUrl?: string;
  key?: string;
  uploading: boolean;
  progress: number;
  error: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function Uploader() {
  const [state, setState] = useState<UploadState>({
    file: null,
    objectUrl: undefined,
    key: undefined,
    uploading: false,
    progress: 0,
    error: false,
  });

  useEffect(() => {
    return () => {
      if (state.objectUrl) {
        URL.revokeObjectURL(state.objectUrl);
      }
    };
  }, [state.objectUrl]);

  const uploadFile = useCallback(async (file: File) => {
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
          isImage: file.type.startsWith("image"),
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

      toast.success("File uploaded successfully.");
    } catch (error) {
      setState((prev) => ({
        ...prev,
        uploading: false,
        error: true,
      }));

      toast.error(
        error instanceof Error ? error.message : "File upload failed."
      );
    }
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const objectUrl = URL.createObjectURL(file);

      setState({
        file,
        objectUrl,
        key: undefined,
        uploading: false,
        progress: 0,
        error: false,
      });

      uploadFile(file);
    },
    [uploadFile]
  );

  const onDropRejected = useCallback((rejections: FileRejection[]) => {
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
        toast.error("Only image files are allowed.");
        break;

      default:
        toast.error(error.message);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    multiple: false,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    accept: {
      "image/*": [],
    },
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative h-64 w-full cursor-pointer overflow-hidden border-2 border-dashed transition-colors",
        isDragActive
          ? "border-primary bg-primary/10"
          : "border-muted-foreground/30 hover:border-primary"
      )}
    >
      <CardContent className="flex h-full items-center justify-center p-4">
        <input {...getInputProps()} />

        {state.uploading ? (
          <div className="space-y-3 text-center">
            <p className="font-medium">Uploading...</p>

            <div className="h-2 w-56 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${state.progress}%` }}
              />
            </div>

            <p className="text-sm text-muted-foreground">
              {state.progress}%
            </p>
          </div>
        ) : state.error ? (
          <RenderErrorState />
        ) : state.objectUrl ? (
          <div className="relative h-full w-full">
            <Image
              src={state.objectUrl}
              alt="Preview"
              fill
              className="rounded-lg object-cover"
            />
          </div>
        ) : (
          <RenderEmptyState isDragActive={isDragActive} />
        )}
      </CardContent>
    </Card>
  );
}