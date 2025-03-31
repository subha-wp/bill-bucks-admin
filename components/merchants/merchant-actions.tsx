/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash, MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface MerchantActionsProps {
  merchant: {
    id: string;
    name: string;
  };
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  mutate: () => void;
}

export function MerchantActions({
  merchant,
  onView,
  onEdit,
  mutate,
}: MerchantActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/merchants/${merchant.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete merchant");
      }

      toast({
        title: "Success",
        description: "Merchant deleted successfully",
      });

      mutate(); // Refresh the merchants list
      setShowDeleteDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete merchant",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onView(merchant.id)}>
            <Eye className="mr-2 h-4 w-4" />
            View details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(merchant.id)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit merchant
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete merchant
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Merchant</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {merchant.name}? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
