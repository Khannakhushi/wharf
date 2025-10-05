"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Server, Trash2, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export interface Registry {
  id: string;
  url: string;
  username?: string;
  password?: string;
  connected: boolean;
  loading: boolean;
}

interface RegistryListProps {
  registries: Registry[];
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onRemove: (id: string) => void;
}

export function RegistryList({
  registries,
  onConnect,
  onDisconnect,
  onRemove,
}: RegistryListProps) {
  if (registries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 text-muted-foreground"
      >
        <Server className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No registries added yet</p>
        <p className="text-sm mt-2">Add a registry to get started</p>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-3">
      {registries.map((registry, index) => (
        <motion.div
          key={registry.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          <Card
            className={`p-4 transition-all hover:shadow-lg hover:shadow-primary/10 ${
              registry.connected
                ? "border-primary/50 shadow-lg shadow-primary/20 bg-accent/50"
                : ""
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2 bg-primary/10 rounded-lg ring-1 ring-primary/20">
                  <Server className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{registry.url}</p>
                  {registry.username && (
                    <p className="text-xs text-muted-foreground">
                      Auth: {registry.username}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {registry.loading ? (
                  <Badge variant="secondary" className="gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Connecting
                  </Badge>
                ) : registry.connected ? (
                  <>
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Connected
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDisconnect(registry.id)}
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <>
                    <Badge variant="outline" className="gap-1">
                      <XCircle className="w-3 h-3" />
                      Offline
                    </Badge>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => onConnect(registry.id)}
                    >
                      Connect
                    </Button>
                  </>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemove(registry.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
