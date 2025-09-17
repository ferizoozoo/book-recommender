import React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Publisher } from "@/components/types";

interface PublisherFormProps {
  publisher?: Publisher;
  onSubmit: (data: {
    name: string;
    address: string;
    website?: string;
    contactEmail: string;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PublisherForm({
  publisher,
  onSubmit,
  onCancel,
  isLoading = false,
}: PublisherFormProps) {
  const [formData, setFormData] = useState({
    name: publisher?.name || "",
    address: publisher?.address || "",
    website: publisher?.website || "",
    contactEmail: publisher?.contactEmail || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      address: formData.address,
      website: formData.website || undefined,
      contactEmail: formData.contactEmail,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-none">
      <CardHeader>
        <CardTitle>
          {publisher ? "Edit Publisher" : "Add New Publisher"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Publisher Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter publisher name"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email *</Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) =>
                setFormData({ ...formData, contactEmail: e.target.value })
              }
              placeholder="Enter contact email"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Enter publisher address"
              rows={3}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              placeholder="https://example.com (optional)"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading
                ? "Saving..."
                : publisher
                ? "Update Publisher"
                : "Add Publisher"}
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
