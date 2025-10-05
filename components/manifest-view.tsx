"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FileCode, Layers, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export interface SubManifest {
  mediaType: string;
  size: number;
  digest: string;
  platform?: {
    architecture: string;
    os: string;
    variant?: string;
  };
}

export interface ManifestData {
  schemaVersion: number;
  mediaType?: string;
  config?: {
    mediaType: string;
    size: number;
    digest: string;
  };
  layers?: Array<{
    mediaType: string;
    size: number;
    digest: string;
  }>;
  manifests?: Array<SubManifest>;
}

interface ManifestViewProps {
  manifest: ManifestData;
  repoName: string;
  tag: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function CopyButton({
  text,
  label,
  delay = 0,
}: {
  text: string;
  label?: string;
  delay?: number;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(label ? `${label} copied` : "Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Button
        size="sm"
        variant="ghost"
        className="h-6 px-2"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="w-3 h-3 text-green-500" />
        ) : (
          <Copy className="w-3 h-3" />
        )}
      </Button>
    </motion.div>
  );
}

export function ManifestView({ manifest, repoName, tag }: ManifestViewProps) {
  const isOCIIndex =
    manifest.mediaType?.includes("index") ||
    manifest.mediaType?.includes("list");
  const totalSize = manifest.layers
    ? manifest.layers.reduce((acc, layer) => acc + layer.size, 0) +
      (manifest.config?.size || 0)
    : 0;

  const imageRef = `${repoName}:${tag}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">
              {repoName}:{tag}
            </h3>
            <CopyButton text={imageRef} label="Image reference" delay={0.1} />
          </div>
          <p className="text-sm text-muted-foreground">
            Schema v{manifest.schemaVersion} • {manifest.mediaType || "Unknown"}
          </p>
        </div>
        {totalSize > 0 && (
          <Badge variant="secondary">{formatBytes(totalSize)}</Badge>
        )}
      </div>

      {isOCIIndex ? (
        <Card className="p-4 glow-border overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"></div>
          <div className="relative flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-primary/10 rounded">
              <Layers className="w-4 h-4 text-primary" />
            </div>
            <span className="font-medium text-sm">
              Multi-Platform Manifest ({manifest.manifests?.length || 0}{" "}
              platforms)
            </span>
          </div>
          <ScrollArea className="h-[300px]">
            <div className="relative space-y-3">
              {manifest.manifests?.map(
                (subManifest: SubManifest, index: number) => (
                  <motion.div
                    key={subManifest.digest}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                          Platform {index + 1}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {formatBytes(subManifest.size || 0)}
                        </Badge>
                      </div>
                      {subManifest.platform && (
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">
                            {subManifest.platform.os}/
                            {subManifest.platform.architecture}
                            {subManifest.platform.variant &&
                              ` (${subManifest.platform.variant})`}
                          </p>
                          <CopyButton
                            text={`${subManifest.platform.os}/${
                              subManifest.platform.architecture
                            }${
                              subManifest.platform.variant
                                ? `/${subManifest.platform.variant}`
                                : ""
                            }`}
                            label="Platform"
                            delay={index * 0.05 + 0.1}
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className="font-mono text-xs truncate flex-1"
                          title={subManifest.digest}
                        >
                          {subManifest.digest}
                        </p>
                        <CopyButton
                          text={subManifest.digest}
                          label="Digest"
                          delay={index * 0.05 + 0.15}
                        />
                      </div>
                    </div>
                    {index < (manifest.manifests?.length || 0) - 1 && (
                      <Separator className="my-2" />
                    )}
                  </motion.div>
                )
              )}
            </div>
          </ScrollArea>
        </Card>
      ) : (
        <>
          {manifest.config && (
            <Card className="p-4 glow-border overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"></div>
              <div className="relative flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-primary/10 rounded">
                  <FileCode className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium text-sm">Config</span>
              </div>
              <div className="relative space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-mono text-xs">
                    {manifest.config.mediaType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size:</span>
                  <span className="font-mono">
                    {formatBytes(manifest.config.size)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Digest:</span>
                  <div className="flex items-center gap-1">
                    <span
                      className="font-mono text-xs truncate max-w-[200px]"
                      title={manifest.config.digest}
                    >
                      {manifest.config.digest.substring(0, 20)}...
                    </span>
                    <CopyButton
                      text={manifest.config.digest}
                      label="Config digest"
                      delay={0.1}
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {manifest.layers && manifest.layers.length > 0 && (
            <Card className="p-4 glow-border overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"></div>
              <div className="relative flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-primary/10 rounded">
                  <Layers className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium text-sm">
                  Layers ({manifest.layers.length})
                </span>
              </div>
              <ScrollArea className="h-[300px]">
                <div className="relative space-y-3">
                  {manifest.layers.map((layer, index) => (
                    <motion.div
                      key={layer.digest}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">
                            Layer {index + 1}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {formatBytes(layer.size)}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className="font-mono text-xs truncate flex-1"
                            title={layer.digest}
                          >
                            {layer.digest}
                          </p>
                          <CopyButton
                            text={layer.digest}
                            label="Layer digest"
                            delay={index * 0.05 + 0.1}
                          />
                        </div>
                      </div>
                      {index < (manifest.layers?.length || 0) - 1 && (
                        <Separator className="my-2" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          )}
        </>
      )}
    </motion.div>
  );
}
