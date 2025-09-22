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
import { Edit, Trash2, Plus, ExternalLink } from "lucide-react";
import { DeleteConfirmationDialog } from "./deleteConfirmationDialog";
import type { Publisher } from "@/components/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PublisherForm } from "./publisherForm";

interface PublishersTableProps {
  publishers: Publisher[];
  onEdit: (publisher: Publisher) => void;
  onDelete: (id: string) => void;
  onAdd: (publisherData: any) => void;
  isLoading?: boolean;
}

export function PublishersTable({
  publishers,
  onEdit,
  onDelete,
  onAdd,
  isLoading = false,
}: PublishersTableProps) {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    publisher: Publisher | null;
  }>({
    open: false,
    publisher: null,
  });

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    publisher: Publisher | null;
  }>({
    open: false,
    publisher: null,
  });

  const handleDeleteClick = (publisher: Publisher) => {
    setDeleteDialog({ open: true, publisher });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.publisher) {
      onDelete(deleteDialog.publisher.id);
      setDeleteDialog({ open: false, publisher: null });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Publishers</CardTitle>

          <Dialog>
            <DialogTrigger>
              <div className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer">
                <Plus className="w-4 h-4 mr-2" />
                Add Publisher
              </div>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <PublisherForm
                onSubmit={onAdd}
                onCancel={() => {
                  const trigger = document.querySelector(
                    '[aria-label="Close"]'
                  );
                  if (trigger instanceof HTMLButtonElement) {
                    trigger.click();
                  }
                }}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {publishers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>
                No publishers found. Add your first publisher to get started.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    {/* <TableHead>Contact Email</TableHead> */}
                    {/* <TableHead>Address</TableHead> */}
                    {/* <TableHead>Website</TableHead> */}
                    {/* <TableHead>Created</TableHead> */}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {publishers.map((publisher) => (
                    <TableRow key={publisher.id}>
                      <TableCell className="text-start font-medium">
                        {publisher.name}
                      </TableCell>
                      {/* <TableCell>{publisher.contactEmail}</TableCell> */}
                      {/* <TableCell>
                        <div className="max-w-xs">
                          <p className="truncate text-sm text-muted-foreground">
                            {publisher.address}
                          </p>
                        </div>
                      </TableCell> */}
                      {/* <TableCell>
                        {publisher.website ? (
                          <a
                            href={publisher.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                          >
                            Visit
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <Badge variant="secondary">No website</Badge>
                        )}
                      </TableCell> */}
                      {/* <TableCell className="text-sm text-muted-foreground">
                        {publisher.createdAt.toDateString()}
                      </TableCell> */}
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Dialog
                            open={editDialog.open}
                            onOpenChange={(open) =>
                              setEditDialog({
                                open,
                                publisher: open ? publisher : null,
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
                                <DialogTitle>Edit Publisher</DialogTitle>
                              </DialogHeader>
                              <PublisherForm
                                publisher={editDialog.publisher || undefined}
                                onSubmit={(publisherData) => {
                                  if (editDialog.publisher?.id) {
                                    onEdit({
                                      ...editDialog.publisher,
                                      ...publisherData,
                                      id: editDialog.publisher.id,
                                      updatedAt: new Date(),
                                    });
                                    setEditDialog({
                                      open: false,
                                      publisher: null,
                                    });
                                  }
                                }}
                                onCancel={() =>
                                  setEditDialog({
                                    open: false,
                                    publisher: null,
                                  })
                                }
                              />
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(publisher)}
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
        onOpenChange={(open) => setDeleteDialog({ open, publisher: null })}
        title="Delete Publisher"
        description={`Are you sure you want to delete "${deleteDialog.publisher?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        isLoading={isLoading}
      />
    </>
  );
}
