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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AuthorForm } from "./authorForm";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface AuthorsTableProps {
  authors: Author[];
  onEdit: (author: Author) => void;
  onDelete: (id: string) => void;
  onAdd: (authorData: any) => void;
  isLoading?: boolean;
}

export function AuthorsTable({
  authors,
  onEdit,
  onDelete,
  onAdd,
  isLoading = false,
}: AuthorsTableProps) {
  const { toast } = useToast();
  const [addDialog, setAddDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    author: Author | null;
  }>({
    open: false,
    author: null,
  });

  const [editDialog, setEditDialog] = useState<{
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

  const handleAddSubmit = async (data: any) => {
    try {
      await onAdd(data);
      setAddDialog(false);
      toast({
        title: "Success",
        description: "Author added successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add author",
        variant: "destructive",
      });
    }
  };

  const handleEditSubmit = async (authorData: any) => {
    if (!editDialog.author?.id) return;

    try {
      await onEdit({
        ...editDialog.author,
        ...authorData,
        id: editDialog.author.id,
        updatedAt: new Date(),
      });
      setEditDialog({
        open: false,
        author: null,
      });
      toast({
        title: "Success",
        description: "Author updated successfully",
        variant: "success",
      });
    } catch (error) {
      setEditDialog({
        open: false,
        author: null,
      });
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update author",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Authors</CardTitle>

          <Dialog open={addDialog} onOpenChange={setAddDialog}>
            <DialogTrigger>
              <div className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer">
                <Plus className="w-4 h-4 mr-2" />
                Add Author
              </div>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <AuthorForm
                onSubmit={handleAddSubmit}
                onCancel={() => setAddDialog(false)}
              />
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
                    {/* <TableHead>Email</TableHead> */}
                    {/* <TableHead>Biography</TableHead> */}
                    {/* <TableHead>Created</TableHead> */}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {authors.map((author) => (
                    <TableRow key={author.id}>
                      <TableCell className="text-start font-medium">
                        {author.user?.firstName} {author.user?.lastName}
                      </TableCell>
                      {/* <TableCell>{author.email}</TableCell> */}
                      {/* <TableCell>
                        {author.bio ? (
                          <div className="max-w-xs">
                            <p className="truncate text-sm text-muted-foreground">
                              {author.bio}
                            </p>
                          </div>
                        ) : (
                          <Badge variant="secondary">No bio</Badge>
                        )}
                      </TableCell> */}
                      {/* <TableCell className="text-sm text-muted-foreground">
                        {author.createdAt.toLocaleDateString()}
                      </TableCell> */}
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Dialog
                            open={editDialog.open}
                            onOpenChange={(open) =>
                              setEditDialog({
                                open,
                                author: open ? author : null,
                              })
                            }
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={isLoading}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white">
                              <DialogHeader>
                                <DialogTitle>Edit Author</DialogTitle>
                              </DialogHeader>
                              <AuthorForm
                                author={editDialog.author || undefined}
                                isLoading={isLoading}
                                onSubmit={handleEditSubmit}
                                onCancel={() =>
                                  setEditDialog({ open: false, author: null })
                                }
                              />
                            </DialogContent>
                          </Dialog>
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
      <Toaster />
    </>
  );
}
