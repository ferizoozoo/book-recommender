import React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Author } from "@/components/types";

interface AuthorFormProps {
  author?: Author;
  onSubmit: (data: { bio?: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AuthorForm({
  author,
  onSubmit,
  onCancel,
  isLoading = false,
}: AuthorFormProps) {
  const [formData, setFormData] = useState({
    bio: author?.bio || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      bio: formData.bio,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-none">
      <CardHeader>
        <CardTitle>{author ? "Edit Author" : "Add New Author"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter author name"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter email address"
              required
              disabled={isLoading}
            />
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="bio">Biography</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              placeholder="Enter author biography (optional)"
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading
                ? "Saving..."
                : author
                ? "Update Author"
                : "Add Author"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
