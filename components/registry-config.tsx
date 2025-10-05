"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { motion } from "motion/react";
import { Plus } from "lucide-react";

interface RegistryConfigProps {
  onAddRegistry: (url: string, username?: string, password?: string) => void;
}

export function RegistryConfig({ onAddRegistry }: RegistryConfigProps) {
  const [url, setUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [useAuth, setUseAuth] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRegistry(
      url,
      useAuth ? username || undefined : undefined,
      useAuth ? password || undefined : undefined
    );
    setUrl("");
    setUsername("");
    setPassword("");
    setUseAuth(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="p-6 glow-border glow-card overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute top-0 inset-x-0 h-px glow-line"></div>
        <div className="relative">
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Label htmlFor="registry-url" className="text-sm font-medium">
                Registry URL
              </Label>
              <Input
                id="registry-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://registry.example.com"
                required
                className="h-11"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between p-3 rounded-lg border bg-card/50"
            >
              <div className="space-y-0.5">
                <Label htmlFor="use-auth" className="text-sm font-medium">
                  Use Authentication
                </Label>
                <p className="text-xs text-muted-foreground">
                  Enable if your registry requires credentials
                </p>
              </div>
              <Switch
                id="use-auth"
                checked={useAuth}
                onCheckedChange={setUseAuth}
              />
            </motion.div>

            {useAuth && (
              <>
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                    className="h-11"
                  />
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"
                    className="h-11"
                  />
                </motion.div>
              </>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                type="submit"
                className="w-full h-11 text-base font-medium gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Registry
              </Button>
            </motion.div>
          </form>
        </div>
      </Card>
    </motion.div>
  );
}
