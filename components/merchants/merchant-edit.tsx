/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { MerchantForm, MerchantFormData } from "./merchant-form";

interface MerchantEditProps {
  merchant: (MerchantFormData & { id: string }) | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function MerchantEdit({
  merchant,
  open,
  onOpenChange,
  onSuccess,
}: MerchantEditProps) {
  if (!merchant) return null;

  const handleSubmit = async (data: MerchantFormData) => {
    try {
      const response = await fetch(`/api/merchants/${merchant.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update merchant");
      }

      toast({
        title: "Success",
        description: "Merchant updated successfully",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update merchant",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Merchant</DialogTitle>
        </DialogHeader>
        <MerchantForm
          initialData={merchant}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
        />
      </DialogContent>
    </Dialog>
  );
}
