"use client";

import { motion } from "motion/react";
import { Navbar } from "@/components/navbar";
import { Card } from "@/components/ui/card";
import {
  Container,
  Anchor,
  Waves,
  Package,
  Tag,
  Layers,
  Github,
  ExternalLink,
  Sparkles,
  Zap,
  Shield,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const features = [
    {
      icon: Container,
      title: "Multi-Registry Support",
      description:
        "Connect to multiple Docker registries simultaneously and manage them from a single, unified interface.",
      color: "text-blue-500",
    },
    {
      icon: Layers,
      title: "Manifest Inspector",
      description:
        "Deep dive into image manifests, examine layers, and understand your container images in detail.",
      color: "text-purple-500",
    },
    {
      icon: Tag,
      title: "Tag Management",
      description:
        "View, explore, and delete container tags with an intuitive interface designed for efficiency.",
      color: "text-green-500",
    },
    {
      icon: Zap,
      title: "Real-time Stats",
      description:
        "Track registries, repositories, and tags at a glance with live statistics and insights.",
      color: "text-yellow-500",
    },
    {
      icon: Shield,
      title: "Secure Authentication",
      description:
        "Support for authenticated registries with credentials stored securely in your browser.",
      color: "text-red-500",
    },
    {
      icon: Sparkles,
      title: "Beautiful UI",
      description:
        "Modern, responsive design with smooth animations and dark mode support for comfortable viewing.",
      color: "text-pink-500",
    },
  ];

  const techStack = [
    { name: "Next.js 15", category: "Framework" },
    { name: "React 19", category: "UI Library" },
    { name: "TypeScript", category: "Language" },
    { name: "Tailwind CSS", category: "Styling" },
    { name: "Framer Motion", category: "Animations" },
    { name: "Radix UI", category: "Components" },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen gradient-bg">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              className="flex justify-center mb-6"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="relative">
                <Anchor className="w-20 h-20 text-primary glow-text" />
                <motion.div
                  className="absolute -bottom-2 -right-2"
                  animate={{
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <Waves className="w-8 h-8 text-primary/60" />
                </motion.div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-bold mb-4 glow-text"
            >
              Welcome to Wharf
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              A modern, beautiful Docker Registry UI for managing and exploring
              your container registries with ease and elegance.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <Card className="p-8 glow-border glow-card relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute top-0 inset-x-0 h-px glow-line"></div>
              <div className="relative">
                <h2 className="text-3xl font-bold mb-6 text-center">
                  What is Wharf?
                </h2>
                <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                  <p>
                    Wharf is a powerful, modern web application designed to
                    simplify Docker registry management. Built with the latest
                    web technologies, it provides an intuitive interface for
                    developers and DevOps teams to interact with their Docker
                    registries.
                  </p>
                  <p>
                    Whether you&apos;re managing a single private registry or
                    multiple registries across different environments, Wharf
                    brings all your container images into one beautiful, unified
                    dashboard. View repositories, inspect manifests, manage
                    tags, and gain insights into your container ecosystem—all
                    with a delightful user experience.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <Card className="p-6 h-full glow-border glow-card-hover cursor-default relative overflow-hidden group">
                    <div className="absolute top-0 inset-x-0 h-px glow-line opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <motion.div
                        className={`mb-4 ${feature.color}`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <feature.icon className="w-10 h-10" />
                      </motion.div>
                      <h3 className="text-xl font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Tech Stack</h2>
            <Card className="p-8 glow-border glow-card relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-px glow-line"></div>
              <div className="relative grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {techStack.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="p-4 rounded-lg bg-primary/5 border border-primary/10 hover:border-primary/30 transition-colors"
                  >
                    <div className="text-sm text-muted-foreground mb-1">
                      {tech.category}
                    </div>
                    <div className="text-lg font-semibold">{tech.name}</div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center space-y-6"
          >
            <h2 className="text-3xl font-bold">Get Started</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Ready to streamline your Docker registry management? Connect to
              your registries and start exploring your container images today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative group cursor-pointer">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-primary opacity-75 group-hover:opacity-100 rounded-lg blur transition duration-300"></div>
                    <div className="relative flex items-center gap-2 px-8 py-3 bg-background rounded-lg border border-primary/50 group-hover:border-primary transition-colors">
                      <Package className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-lg">
                        Go to Dashboard
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
              <Link
                href="https://github.com/khannakhushi/wharf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-2 px-8 py-3 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                    <Github className="w-5 h-5" />
                    <span className="font-semibold text-lg">
                      View on GitHub
                    </span>
                    <ExternalLink className="w-4 h-4 opacity-70" />
                  </div>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
