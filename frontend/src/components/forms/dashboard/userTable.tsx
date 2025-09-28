import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserForm } from "./userForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Plus } from "lucide-react";
import { DeleteConfirmationDialog } from "./deleteConfirmationDialog";
import type { User } from "@/components/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onAdd: (userData: UserFormData) => Promise<void>;
  isLoading?: boolean;
}

export function UserTable({
  users,
  onEdit,
  onDelete,
  onAdd,
  isLoading = false,
}: UserTableProps) {
  const { toast } = useToast();
  const [addDialog, setAddDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    user: User | null;
  }>({
    open: false,
    user: null,
  });

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    user: User | null;
  }>({
    open: false,
    user: null,
  });

  const handleDeleteClick = (user: User) => {
    setDeleteDialog({ open: true, user });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.user) {
      onDelete(deleteDialog.user.id);
      setDeleteDialog({ open: false, user: null });
    }
  };

  const handleAddSubmit = async (data: UserFormData) => {
    try {
      await onAdd(data);
      setAddDialog(false);
      toast({
        title: "Success",
        description: "User added successfully",
        variant: "success",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add user",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleEditSubmit = async (userData: UserFormData) => {
    if (!editDialog.user?.id) {
      toast({
        title: "Error",
        description: "No user selected for editing",
        variant: "destructive",
      });
      setEditDialog({ open: false, user: null });
      return false;
    }

    try {
      const updatedUserData = {
        id: editDialog.user?.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        ...(userData.password ? { password: userData.password } : {}),
      };

      await onEdit(updatedUserData);
      setEditDialog({
        open: false,
        user: null,
      });
      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "success",
      });
      return true;
    } catch (error) {
      setEditDialog({
        open: false,
        user: null,
      });
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update user",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Users</CardTitle>
          <Dialog open={addDialog} onOpenChange={setAddDialog}>
            <DialogTrigger>
              <div className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </div>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <UserForm
                onSubmit={handleAddSubmit}
                onCancel={() => setAddDialog(false)}
                isLoading={isLoading}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {users?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No users found. Add your first user to get started.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length > 0 &&
                    users?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {user.email}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.role}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Dialog
                              open={editDialog.open}
                              onOpenChange={(open) => {
                                setEditDialog({
                                  open,
                                  user: open ? user : null,
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
                                  <DialogTitle>Edit User</DialogTitle>
                                </DialogHeader>
                                <UserForm
                                  user={editDialog.user || undefined}
                                  isLoading={isLoading}
                                  onSubmit={handleEditSubmit}
                                  onCancel={() =>
                                    setEditDialog({ open: false, user: null })
                                  }
                                />
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteClick(user)}
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
        onOpenChange={(open) => setDeleteDialog({ open, user: null })}
        title="Delete User"
        description={`Are you sure you want to delete "${deleteDialog.user?.firstName} ${deleteDialog.user?.lastName}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        isLoading={isLoading}
      />
      <Toaster />
    </>
  );
}
