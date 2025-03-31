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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useSWR from "swr";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { MerchantActions } from "@/components/merchants/merchant-actions";
import { MerchantView } from "@/components/merchants/merchant-view";
import { MerchantEdit } from "@/components/merchants/merchant-edit";

interface Merchant {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  cashbackAmount: number;
  logoUrl?: string;
  shopImageUrl?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
}

interface NewMerchant {
  name: string;
  address: string;
  city: string;
  phone: string;
  cashbackAmount: number;
  logoUrl: string;
  shopImageUrl: string;
  latitude: number;
  longitude: number;
}

const initialMerchantState: NewMerchant = {
  name: "",
  address: "",
  city: "",
  phone: "",
  cashbackAmount: 3,
  logoUrl: "",
  shopImageUrl: "",
  latitude: 0,
  longitude: 0,
};

export default function MerchantsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(
    null
  );
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newMerchant, setNewMerchant] =
    useState<NewMerchant>(initialMerchantState);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMerchant((prev) => ({
      ...prev,
      [name]:
        name === "cashbackAmount" || name === "latitude" || name === "longitude"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/merchants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMerchant),
      });

      if (!response.ok) {
        throw new Error("Failed to create merchant");
      }

      toast({
        title: "Success",
        description: "Merchant created successfully",
      });

      setIsOpen(false);
      setNewMerchant(initialMerchantState);
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
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Merchant</DialogTitle>
                <DialogDescription>
                  Enter the merchant details below
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Input
                    name="name"
                    placeholder="Merchant Name"
                    value={newMerchant.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Input
                    name="address"
                    placeholder="Address"
                    value={newMerchant.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Input
                    name="city"
                    placeholder="City"
                    value={newMerchant.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Input
                    name="phone"
                    placeholder="Phone Number"
                    value={newMerchant.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Input
                    name="cashbackAmount"
                    type="number"
                    placeholder="Cashback Amount (%)"
                    value={newMerchant.cashbackAmount}
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
                    value={newMerchant.logoUrl}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Input
                    name="shopImageUrl"
                    placeholder="Shop Image URL"
                    value={newMerchant.shopImageUrl}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="latitude"
                    type="number"
                    placeholder="Latitude"
                    value={newMerchant.latitude}
                    onChange={handleInputChange}
                    required
                    step="any"
                  />
                  <Input
                    name="longitude"
                    type="number"
                    placeholder="Longitude"
                    value={newMerchant.longitude}
                    onChange={handleInputChange}
                    required
                    step="any"
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Add Merchant</Button>
                </DialogFooter>
              </form>
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
                <TableHead>Address</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Cashback %</TableHead>
                <TableHead>Added On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {merchants?.map((merchant) => (
                <TableRow key={merchant.id}>
                  <TableCell className="font-medium">{merchant.name}</TableCell>
                  <TableCell>{merchant.address}</TableCell>
                  <TableCell>{merchant.city}</TableCell>
                  <TableCell>{merchant.phone}</TableCell>
                  <TableCell>{merchant.cashbackAmount}%</TableCell>
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
