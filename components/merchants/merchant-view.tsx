/* eslint-disable @next/next/no-img-element */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MerchantViewProps {
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
    createdAt: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MerchantView({
  merchant,
  open,
  onOpenChange,
}: MerchantViewProps) {
  if (!merchant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Merchant Details</DialogTitle>
          <DialogDescription>View merchant information</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={merchant.logoUrl} alt={merchant.name} />
              <AvatarFallback>
                {merchant.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{merchant.name}</h3>
              <p className="text-sm text-muted-foreground">{merchant.phone}</p>
            </div>
          </div>

          {merchant.shopImageUrl && (
            <div className="aspect-video overflow-hidden rounded-lg">
              <img
                src={merchant.shopImageUrl}
                alt={`${merchant.name} shop`}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="grid gap-2">
            <div>
              <label className="text-sm font-medium">Address</label>
              <p className="text-sm text-muted-foreground">
                {merchant.address}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">City</label>
              <p className="text-sm text-muted-foreground">{merchant.city}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Cashback</label>
              <p className="text-sm text-muted-foreground">
                {merchant.cashbackAmount}%
              </p>
            </div>
            {merchant.latitude && merchant.longitude && (
              <div>
                <label className="text-sm font-medium">Location</label>
                <p className="text-sm text-muted-foreground">
                  {merchant.latitude}, {merchant.longitude}
                </p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium">Added On</label>
              <p className="text-sm text-muted-foreground">
                {new Date(merchant.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
