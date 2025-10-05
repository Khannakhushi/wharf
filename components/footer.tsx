"use client";

import { motion } from "motion/react";
import { Heart, Info } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-t border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 mt-auto"
    >
      <div className="absolute inset-x-0 top-0 h-px glow-line"></div>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            </motion.div>
            <span>by</span>
            <a
              href="https://khyaatikhanna.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors relative group"
            >
              Khyaati Khanna
              <motion.span
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"
                whileHover={{ width: "100%" }}
              />
            </a>
          </div>
          <Link href="/about">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              <Info className="w-4 h-4" />
              <span>About</span>
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.footer>
  );
}
