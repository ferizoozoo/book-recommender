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
import type { Author, Book, Publisher } from "@/components/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BookForm } from "./bookForm";

interface BooksTableProps {
  books: Array<Book & { author: Author; publisher: Publisher }>;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onAdd: (bookData: any) => void;
  isLoading?: boolean;
}

export function BooksTable({
  books,
  onEdit,
  onDelete,
  onAdd,
  isLoading = false,
}: BooksTableProps) {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    book: Book | null;
  }>({
    open: false,
    book: null,
  });

  const handleDeleteClick = (book: Book) => {
    setDeleteDialog({ open: true, book });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.book) {
      onDelete(deleteDialog.book.id);
      setDeleteDialog({ open: false, book: null });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Books</CardTitle>
          <Dialog>
            <DialogTrigger>
              <Button disabled={isLoading}>
                <Plus className="w-4 h-4 mr-2" />
                Add Book
              </Button>
            </DialogTrigger>
            <DialogContent>
              <BookForm onSubmit={onAdd} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {books.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No books found. Add your first book to get started.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Publisher</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>ISBN</TableHead>
                    <TableHead>Pages</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {books.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-medium">{book.title}</p>
                          {book.description && (
                            <p className="text-sm text-muted-foreground truncate max-w-xs">
                              {book.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{book.author.name}</TableCell>
                      <TableCell>{book.publisher.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{book.genre}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {book.isbn}
                      </TableCell>
                      <TableCell>{book.pages}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {book.publishedDate.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(book)}
                            disabled={isLoading}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(book)}
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
        onOpenChange={(open) => setDeleteDialog({ open, book: null })}
        title="Delete Book"
        description={`Are you sure you want to delete "${deleteDialog.book?.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        isLoading={isLoading}
      />
    </>
  );
}
