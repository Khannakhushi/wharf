"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Package, Copy, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface RepositoryListProps {
  repositories: string[];
  onSelectRepo: (repo: string) => void;
  selectedRepo?: string;
  onDeleteRepo?: (repo: string) => Promise<void>;
}

export function RepositoryList({
  repositories,
  onSelectRepo,
  selectedRepo,
  onDeleteRepo,
}: RepositoryListProps) {
  const [copiedRepo, setCopiedRepo] = useState<string | null>(null);
  const [repoToDelete, setRepoToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopy = async (e: React.MouseEvent, repo: string) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(repo);
    setCopiedRepo(repo);
    toast.success("Repository name copied");
    setTimeout(() => setCopiedRepo(null), 2000);
  };

  const handleDeleteClick = (e: React.MouseEvent, repo: string) => {
    e.stopPropagation();
    setRepoToDelete(repo);
  };

  const handleDeleteConfirm = async () => {
    if (!repoToDelete || !onDeleteRepo) return;

    setIsDeleting(true);
    try {
      await onDeleteRepo(repoToDelete);
      toast.success("Repository deleted");
      setRepoToDelete(null);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      toast.error(errorMsg);
      console.error("Repository deletion error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (repositories.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 text-muted-foreground"
      >
        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No repositories found</p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="grid gap-3">
        {repositories.map((repo, index) => (
          <motion.div
            key={repo}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <Card
              className={`p-4 cursor-pointer transition-all hover:shadow-lg hover:shadow-primary/10 hover:border-primary/50 ${
                selectedRepo === repo
                  ? "bg-accent border-primary/50 shadow-lg shadow-primary/20"
                  : ""
              }`}
              onClick={() => onSelectRepo(repo)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium truncate">{repo}</span>
                </div>
                {selectedRepo === repo && (
                  <div className="flex items-center gap-1">
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2"
                        onClick={(e) => handleCopy(e, repo)}
                      >
                        {copiedRepo === repo ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </motion.div>
                    {onDeleteRepo && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.15 }}
                      >
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 hover:text-destructive"
                          onClick={(e) => handleDeleteClick(e, repo)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <AlertDialog
        open={!!repoToDelete}
        onOpenChange={() => setRepoToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Repository</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all tags in{" "}
              <span className="font-mono font-semibold">{repoToDelete}</span>?
              <br />
              <br />
              This will delete all manifests for this repository. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
