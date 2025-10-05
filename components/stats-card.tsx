"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  delay?: number;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  delay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.02 }}
    >
      <Card className="p-4 glow-border glow-card-hover overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {value}
            </p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg ring-1 ring-primary/20 shadow-lg shadow-primary/20">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
