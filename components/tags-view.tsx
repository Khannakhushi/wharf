"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Tag, Copy, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface TagsViewProps {
  repoName: string;
  tags: string[];
  onSelectTag: (tag: string) => void;
  onDeleteTag?: (tag: string) => Promise<void>;
}

export function TagsView({
  repoName,
  tags,
  onSelectTag,
  onDeleteTag,
}: TagsViewProps) {
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [tagToDelete, setTagToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopy = async (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    const fullRef = `${repoName}:${tag}`;
    await navigator.clipboard.writeText(fullRef);
    setCopiedTag(tag);
    toast.success("Image reference copied");
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const handleDeleteClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    setTagToDelete(tag);
  };

  const handleDeleteConfirm = async () => {
    if (!tagToDelete || !onDeleteTag) return;

    setIsDeleting(true);
    try {
      await onDeleteTag(tagToDelete);
      toast.success("Tag deleted successfully");
      setTagToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete tag");
    } finally {
      setIsDeleting(false);
    }
  };

  if (tags.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 text-muted-foreground"
      >
        <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No tags found for {repoName}</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2"
      >
        <h3 className="text-lg font-semibold">{repoName}</h3>
        <Badge variant="outline">{tags.length} tags</Badge>
      </motion.div>

      <div className="grid gap-2">
        {tags.map((tag, index) => (
          <motion.div
            key={tag}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03, duration: 0.3 }}
          >
            <Card
              className="p-3 hover:bg-accent transition-all hover:shadow-lg hover:shadow-primary/10 hover:border-primary/50 cursor-pointer"
              onClick={() => onSelectTag(tag)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-sm">{tag}</span>
                </div>
                <div className="flex items-center gap-1">
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 + 0.1 }}
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2"
                      onClick={(e) => handleCopy(e, tag)}
                    >
                      {copiedTag === tag ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </motion.div>
                  {onDeleteTag && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.03 + 0.15 }}
                    >
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 hover:text-destructive"
                        onClick={(e) => handleDeleteClick(e, tag)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <AlertDialog
        open={!!tagToDelete}
        onOpenChange={() => setTagToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-mono font-semibold">
                {repoName}:{tagToDelete}
              </span>
              ?
              <br />
              <br />
              This will delete the manifest from the registry. This action
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
    </div>
  );
}
