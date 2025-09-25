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
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface BooksTableProps {
  books: Array<Book & { author: Author; publisher: Publisher }>;
  authors: Author[];
  publishers: Publisher[];
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onAdd: (bookData: any) => void;
  isLoading?: boolean;
}

export function BooksTable({
  books,
  authors,
  publishers,
  onEdit,
  onDelete,
  onAdd,
  isLoading = false,
}: BooksTableProps) {
  const { toast } = useToast();
  const [addDialog, setAddDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    book: Book | null;
  }>({
    open: false,
    book: null,
  });

  const [editDialog, setEditDialog] = useState<{
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

  const handleAddSubmit = async (data: any) => {
    try {
      await onAdd(data);
      setAddDialog(false);
      toast({
        title: "Success",
        description: "Book added successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add book",
        variant: "destructive",
      });
    }
  };

  const handleEditSubmit = async (bookData: any) => {
    debugger;
    if (!editDialog.book?.id) {
      toast({
        title: "Error",
        description: "No book selected for editing",
        variant: "destructive",
      });
      setEditDialog({ open: false, book: null });
      return;
    }

    try {
      const updatedBookData = {
        id: editDialog.book?.id,
        title: bookData.title,
        isbn: bookData.isbn,
        authorId: bookData.authorId,
        publisherId: bookData.publisherId,
        publishedDate: bookData.publishedDate,
        year: new Date(bookData.publishedDate).getFullYear(),
        genre: bookData.genre || editDialog.book?.genre,
        pages: bookData.pages || editDialog.book?.pages,
        createdAt: editDialog.book?.createdAt,
        updatedAt: new Date(),
      };

      await onEdit(updatedBookData);
      setEditDialog({
        open: false,
        book: null,
      });
      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "success",
      });
    } catch (error) {
      setEditDialog({
        open: false,
        book: null,
      });
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update book",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Books</CardTitle>
          <Dialog open={addDialog} onOpenChange={setAddDialog}>
            <DialogTrigger>
              <div className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer">
                <Plus className="w-4 h-4 mr-2" />
                Add Book
              </div>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Add New Book</DialogTitle>
              </DialogHeader>
              <BookForm
                authors={authors}
                publishers={publishers}
                onSubmit={handleAddSubmit}
                onCancel={() => setAddDialog(false)}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {books?.length === 0 ? (
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
                    <TableHead>ISBN</TableHead>
                    <TableHead>Published</TableHead>
                    {/* <TableHead>Genre</TableHead> */}
                    {/* <TableHead>Pages</TableHead> */}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {books.length > 0 &&
                    books?.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-medium text-start">
                              {book.title}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{book.author?.name || "N/A"}</TableCell>
                        <TableCell>{book.publisher?.name || "N/A"}</TableCell>
                        {/* <TableCell>
                          <Badge variant="secondary">{book.genre}</Badge>
                        </TableCell> */}
                        <TableCell className="font-mono text-sm">
                          {book.isbn}
                        </TableCell>
                        {/* <TableCell>{book.pages}</TableCell> */}
                        <TableCell className="text-sm text-muted-foreground">
                          {book.year}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Dialog
                              open={editDialog.open}
                              onOpenChange={(open) => {
                                setEditDialog({
                                  open,
                                  book: open ? book : null,
                                });
                              }}
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
                                  <DialogTitle>Edit Book</DialogTitle>
                                </DialogHeader>
                                <BookForm
                                  book={editDialog.book || undefined}
                                  authors={authors}
                                  publishers={publishers}
                                  isLoading={isLoading}
                                  onSubmit={handleEditSubmit}
                                  onCancel={() =>
                                    setEditDialog({ open: false, book: null })
                                  }
                                />
                              </DialogContent>
                            </Dialog>
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
      <Toaster />
    </>
  );
}
