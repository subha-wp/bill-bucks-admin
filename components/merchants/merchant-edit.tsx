/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface MerchantEditProps {
  merchant: {
    id: string;
    name: string;
    address: string;
    phone: string;
    city: string;
    cashbackAmount: number;
    logoUrl?: string;
    shopImageUrl?: string;
    latitude?: number;
    longitude?: number;
  } | null;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    city: "",
    cashbackAmount: 0,
    logoUrl: "",
    shopImageUrl: "",
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    if (merchant) {
      setFormData({
        name: merchant.name,
        address: merchant.address,
        phone: merchant.phone,
        city: merchant.city,
        cashbackAmount: merchant.cashbackAmount,
        logoUrl: merchant.logoUrl || "",
        shopImageUrl: merchant.shopImageUrl || "",
        latitude: merchant.latitude || 0,
        longitude: merchant.longitude || 0,
      });
    }
  }, [merchant]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "cashbackAmount" || name === "latitude" || name === "longitude"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/merchants/${merchant.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!merchant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Merchant</DialogTitle>
          <DialogDescription>Update merchant information</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              name="name"
              placeholder="Merchant Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Input
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Input
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Input
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Input
              name="cashbackAmount"
              type="number"
              placeholder="Cashback Amount (%)"
              value={formData.cashbackAmount}
              onChange={handleInputChange}
              required
              min="0"
              max="100"
              step="0.1"
            />
          </div>
          <div className="grid gap-2">
            <Input
              name="logoUrl"
              placeholder="Logo URL"
              value={formData.logoUrl}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Input
              name="shopImageUrl"
              placeholder="Shop Image URL"
              value={formData.shopImageUrl}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="latitude"
              type="number"
              placeholder="Latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              required
              step="any"
            />
            <Input
              name="longitude"
              type="number"
              placeholder="Longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              required
              step="any"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Merchant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
