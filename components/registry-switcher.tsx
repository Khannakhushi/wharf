"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Server,
  CheckCircle2,
  XCircle,
  Loader2,
  Plus,
  ChevronDown,
} from "lucide-react";
import { Registry } from "@/components/registry-list";

interface RegistrySwitcherProps {
  registries: Registry[];
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onAddNew: () => void;
}

export function RegistrySwitcher({
  registries,
  onConnect,
  onDisconnect,
  onAddNew,
}: RegistrySwitcherProps) {
  const connectedCount = registries.filter((r) => r.connected).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-primary/20 hover:border-primary/40"
        >
          <Server className="w-4 h-4" />
          <span className="hidden sm:inline">
            {connectedCount} / {registries.length}
          </span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Registries</p>
              <p className="text-xs text-muted-foreground">
                {connectedCount} connected
              </p>
            </div>
            <Button
              size="sm"
              variant="default"
              onClick={onAddNew}
              className="gap-1"
            >
              <Plus className="w-3 h-3" />
              Add
            </Button>
          </div>
        </div>

        <ScrollArea className="max-h-[400px]">
          <div className="p-2">
            {registries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Server className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No registries added</p>
              </div>
            ) : (
              <div className="space-y-1">
                {registries.map((registry, index) => (
                  <motion.div
                    key={registry.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <div
                      className={`p-3 rounded-lg border transition-all cursor-pointer hover:bg-accent ${
                        registry.connected
                          ? "border-primary/50 bg-accent/50"
                          : "border-border/50"
                      }`}
                      onClick={() => {
                        if (registry.loading) return;
                        if (registry.connected) {
                          onDisconnect(registry.id);
                        } else {
                          onConnect(registry.id);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {registry.url}
                          </p>
                          {registry.username && (
                            <p className="text-xs text-muted-foreground">
                              {registry.username}
                            </p>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          {registry.loading ? (
                            <Badge
                              variant="secondary"
                              className="gap-1 text-xs"
                            >
                              <Loader2 className="w-3 h-3 animate-spin" />
                            </Badge>
                          ) : registry.connected ? (
                            <Badge variant="default" className="gap-1 text-xs">
                              <CheckCircle2 className="w-3 h-3" />
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="gap-1 text-xs">
                              <XCircle className="w-3 h-3" />
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator />

        <div className="p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs"
            onClick={onAddNew}
          >
            <Plus className="w-3 h-3 mr-2" />
            Add New Registry
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
