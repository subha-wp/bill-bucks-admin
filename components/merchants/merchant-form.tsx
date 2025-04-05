/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import React from "react";

export interface MerchantFormData {
  name: string;
  address: string;
  city: string;
  phone: string;
  cashbackAmount: number;
  logoUrl: string;
  shopImageUrl: string;
  latitude: number;
  longitude: number;
  category: string;
  openingTime: string;
  closingTime: string;
  isOpen: boolean;
  rating: number;
}

interface MerchantFormProps {
  initialData: MerchantFormData;
  onSubmit: (data: MerchantFormData) => void;
  submitLabel?: string;
}

const categories = [
  "Restaurant",
  "Retail",
  "Grocery",
  "Electronics",
  "Fashion",
  "Health & Beauty",
  "Services",
  "Other",
];

export function MerchantForm({
  initialData,
  onSubmit,
  submitLabel = "Save",
}: MerchantFormProps) {
  const [formData, setFormData] = React.useState<MerchantFormData>(initialData);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number" ||
        name === "latitude" ||
        name === "longitude" ||
        name === "cashbackAmount" ||
        name === "rating"
          ? parseFloat(value)
          : name === "isOpen"
          ? value === "true"
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Merchant Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select
            name="category"
            value={formData.category}
            onValueChange={(value) =>
              handleInputChange({
                target: { name: "category", value },
              } as React.ChangeEvent<HTMLSelectElement>)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="openingTime">Opening Time</Label>
          <Input
            id="openingTime"
            name="openingTime"
            type="time"
            value={formData.openingTime}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="closingTime">Closing Time</Label>
          <Input
            id="closingTime"
            name="closingTime"
            type="time"
            value={formData.closingTime}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="cashbackAmount">Cashback Amount (%)</Label>
          <Input
            id="cashbackAmount"
            name="cashbackAmount"
            type="number"
            value={formData.cashbackAmount}
            onChange={handleInputChange}
            required
            min="0"
            max="100"
            step="0.1"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="rating">Rating</Label>
          <Input
            id="rating"
            name="rating"
            type="number"
            value={formData.rating}
            onChange={handleInputChange}
            required
            min="0"
            max="5"
            step="0.1"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="logoUrl">Logo URL</Label>
        <Input
          id="logoUrl"
          name="logoUrl"
          placeholder="Logo URL"
          value={formData.logoUrl}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="shopImageUrl">Shop Image URL</Label>
        <Input
          id="shopImageUrl"
          name="shopImageUrl"
          placeholder="Shop Image URL"
          value={formData.shopImageUrl}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            name="latitude"
            type="number"
            placeholder="Latitude"
            value={formData.latitude}
            onChange={handleInputChange}
            required
            step="any"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            name="longitude"
            type="number"
            placeholder="Longitude"
            value={formData.longitude}
            onChange={handleInputChange}
            required
            step="any"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isOpen"
          name="isOpen"
          checked={formData.isOpen}
          onCheckedChange={(checked: any) =>
            setFormData((prev) => ({ ...prev, isOpen: checked }))
          }
        />
        <Label htmlFor="isOpen">Store is currently open</Label>
      </div>

      <DialogFooter>
        <Button type="submit">{submitLabel}</Button>
      </DialogFooter>
    </form>
  );
}
