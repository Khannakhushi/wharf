"use client";

import { motion } from "motion/react";
import { Anchor, Waves } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { RegistrySwitcher } from "@/components/registry-switcher";
import { Button } from "@/components/ui/button";
import { Registry } from "@/components/registry-list";
import Link from "next/link";

interface NavbarProps {
  connected?: boolean;
  registryUrl?: string;
  onDisconnect?: () => void;
  registries?: Registry[];
  onConnectRegistry?: (id: string) => void;
  onDisconnectRegistry?: (id: string) => void;
  onAddNewRegistry?: () => void;
}

export function Navbar({
  connected,
  registryUrl,
  onDisconnect,
  registries = [],
  onConnectRegistry,
  onDisconnectRegistry,
  onAddNewRegistry,
}: NavbarProps) {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
    >
      <div className="absolute inset-x-0 bottom-0 h-px glow-line"></div>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <motion.div
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="relative">
                <Anchor className="w-8 h-8 text-primary" />
                <motion.div
                  className="absolute -bottom-1 -right-1"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Waves className="w-4 h-4 text-primary/60" />
                </motion.div>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight glow-text">
                  Wharf
                </h1>
                <p className="text-xs text-muted-foreground">Docker Registry</p>
              </div>
            </motion.div>
          </Link>

          <div className="flex items-center gap-4">
            {connected && registryUrl && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden md:flex items-center gap-3"
              >
                <div className="flex items-center gap-2">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Connected</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {registryUrl}
                    </p>
                  </div>
                </div>
                {onConnectRegistry &&
                  onDisconnectRegistry &&
                  onAddNewRegistry && (
                    <RegistrySwitcher
                      registries={registries}
                      onConnect={onConnectRegistry}
                      onDisconnect={onDisconnectRegistry}
                      onAddNew={onAddNewRegistry}
                    />
                  )}
                <Button variant="ghost" size="sm" onClick={onDisconnect}>
                  Disconnect All
                </Button>
              </motion.div>
            )}
            <ModeToggle />
          </div>
        </div>

        {connected && registryUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="md:hidden mt-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </div>
              <span className="text-xs text-muted-foreground truncate">
                {registryUrl}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {onConnectRegistry &&
                onDisconnectRegistry &&
                onAddNewRegistry && (
                  <RegistrySwitcher
                    registries={registries}
                    onConnect={onConnectRegistry}
                    onDisconnect={onDisconnectRegistry}
                    onAddNew={onAddNewRegistry}
                  />
                )}
              <Button variant="ghost" size="sm" onClick={onDisconnect}>
                Disconnect All
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
