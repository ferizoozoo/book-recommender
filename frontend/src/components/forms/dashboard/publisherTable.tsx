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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
              <Button disabled={isLoading}>
                <Plus className="w-4 h-4 mr-2" />
                Add Publisher
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <PublisherForm onSubmit={onAdd} />
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
                    <TableHead>Contact Email</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {publishers.map((publisher) => (
                    <TableRow key={publisher.id}>
                      <TableCell className="font-medium">
                        {publisher.name}
                      </TableCell>
                      <TableCell>{publisher.contactEmail}</TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="truncate text-sm text-muted-foreground">
                            {publisher.address}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {publisher.createdAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(publisher)}
                            disabled={isLoading}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
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
