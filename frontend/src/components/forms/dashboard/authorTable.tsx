"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import { DeleteConfirmationDialog } from "./deleteConfirmationDialog";
import type { Author } from "@/components/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AuthorForm } from "./authorForm";

interface AuthorsTableProps {
  authors: Author[];
  onEdit: (author: Author) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  isLoading?: boolean;
}

export function AuthorsTable({
  authors,
  onEdit,
  onDelete,
  onAdd,
  isLoading = false,
}: AuthorsTableProps) {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    author: Author | null;
  }>({
    open: false,
    author: null,
  });

  const handleDeleteClick = (author: Author) => {
    setDeleteDialog({ open: true, author });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.author) {
      onDelete(deleteDialog.author.id);
      setDeleteDialog({ open: false, author: null });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Authors</CardTitle>

          <Dialog>
            <DialogTrigger>
              <Button disabled={isLoading}>
                <Plus className="w-4 h-4 mr-2" />
                Add Author
              </Button>
            </DialogTrigger>
            <DialogContent>
              <AuthorForm onSubmit={onAdd} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {authors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No authors found. Add your first author to get started.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Biography</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {authors.map((author) => (
                    <TableRow key={author.id}>
                      <TableCell className="font-medium">
                        {author.name}
                      </TableCell>
                      <TableCell>{author.email}</TableCell>
                      <TableCell>
                        {author.bio ? (
                          <div className="max-w-xs">
                            <p className="truncate text-sm text-muted-foreground">
                              {author.bio}
                            </p>
                          </div>
                        ) : (
                          <Badge variant="secondary">No bio</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {author.createdAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(author)}
                            disabled={isLoading}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(author)}
                            disabled={isLoading}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmationDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, author: null })}
        title="Delete Author"
        description={`Are you sure you want to delete "${deleteDialog.author?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        isLoading={isLoading}
      />
    </>
  );
}
