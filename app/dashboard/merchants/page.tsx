/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useSWR from "swr";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { MerchantActions } from "@/components/merchants/merchant-actions";
import { MerchantView } from "@/components/merchants/merchant-view";
import { MerchantEdit } from "@/components/merchants/merchant-edit";
import {
  MerchantForm,
  MerchantFormData,
} from "@/components/merchants/merchant-form";

interface Merchant extends MerchantFormData {
  id: string;
  createdAt: string;
}

const initialMerchantState: MerchantFormData = {
  name: "",
  address: "",
  city: "",
  phone: "",
  cashbackAmount: 3,
  logoUrl: "",
  shopImageUrl: "",
  latitude: 0,
  longitude: 0,
  category: "",
  openingTime: "09:00",
  closingTime: "21:00",
  isOpen: true,
  rating: 0,
};

export default function MerchantsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(
    null
  );
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const {
    data: merchants,
    error,
    isLoading,
    mutate,
  } = useSWR<Merchant[]>(
    "/api/merchants",
    (url) => fetch(url).then((res) => res.json()),
    {
      refreshInterval: 5000,
    }
  );

  const handleSubmit = async (data: MerchantFormData) => {
    try {
      const response = await fetch("/api/merchants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create merchant");
      }

      toast({
        title: "Success",
        description: "Merchant created successfully",
      });

      setIsOpen(false);
      mutate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create merchant",
        variant: "destructive",
      });
    }
  };

  const handleView = (id: string) => {
    const merchant = merchants?.find((m) => m.id === id);
    if (merchant) {
      setSelectedMerchant(merchant);
      setViewDialogOpen(true);
    }
  };

  const handleEdit = (id: string) => {
    const merchant = merchants?.find((m) => m.id === id);
    if (merchant) {
      setSelectedMerchant(merchant);
      setEditDialogOpen(true);
    }
  };

  if (error) {
    toast({
      title: "Error",
      description: "Failed to fetch merchants",
      variant: "destructive",
    });
    return <div>Failed to load merchants</div>;
  }

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Merchants</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>Add Merchant</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Merchant</DialogTitle>
                <DialogDescription>
                  Enter the merchant details below
                </DialogDescription>
              </DialogHeader>
              <MerchantForm
                initialData={initialMerchantState}
                onSubmit={handleSubmit}
                submitLabel="Add Merchant"
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Merchants</CardTitle>
          <CardDescription>
            Manage all merchants on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Cashback %</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Added On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {merchants?.map((merchant) => (
                <TableRow key={merchant.id}>
                  <TableCell className="font-medium">{merchant.name}</TableCell>
                  <TableCell>{merchant.category || "N/A"}</TableCell>
                  <TableCell>{merchant.address}</TableCell>
                  <TableCell>{merchant.city}</TableCell>
                  <TableCell>{merchant.phone}</TableCell>
                  <TableCell>{merchant.cashbackAmount}%</TableCell>
                  <TableCell>{merchant.rating?.toFixed(1) || "N/A"}</TableCell>
                  <TableCell>
                    {merchant.isOpen ? (
                      <span className="text-green-600">Open</span>
                    ) : (
                      <span className="text-red-600">Closed</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(merchant.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <MerchantActions
                      merchant={merchant}
                      onView={handleView}
                      onEdit={handleEdit}
                      mutate={mutate}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <MerchantView
        merchant={selectedMerchant}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />

      <MerchantEdit
        merchant={selectedMerchant}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={mutate}
      />
    </div>
  );
}
