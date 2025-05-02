/* eslint-disable @next/next/no-img-element */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InvoiceDetailsProps {
  invoice: {
    id: string;
    amount: number;
    imageUrl: string;
    status: string;
    createdAt: string;
    user: {
      name: string;
      avatarUrl?: string;
    };
    merchant?: {
      name: string;
      logoUrl?: string;
    };
    isMerchant: boolean;
    cashback?: {
      amount: number;
    };
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvoiceDetails({
  invoice,
  open,
  onOpenChange,
}: InvoiceDetailsProps) {
  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Invoice Details</DialogTitle>
          <DialogDescription>View invoice information</DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1">
          <div className="grid gap-4 py-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={invoice.merchant?.logoUrl}
                  alt={invoice.merchant?.name || "Merchant"}
                />
                <AvatarFallback>
                  {(invoice.merchant?.name || "NA")
                    .substring(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <h3 className="text-lg font-semibold">
                  {invoice.merchant?.name || "Non-Merchant Invoice"}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      invoice.status === "APPROVED"
                        ? "success"
                        : invoice.status === "PENDING"
                        ? "outline"
                        : "destructive"
                    }
                  >
                    {invoice.status}
                  </Badge>
                  <Badge variant={invoice.isMerchant ? "default" : "secondary"}>
                    {invoice.isMerchant ? "Merchant" : "Non-Merchant"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Submitted by {invoice.user.name}
                </p>
              </div>
            </div>

            <div className="max-h-[400px] overflow-hidden rounded-lg border">
              <img
                src={invoice.imageUrl}
                alt="Invoice"
                className="w-full h-auto object-contain"
              />
            </div>

            <div className="grid gap-2">
              <div>
                <label className="text-sm font-medium">Amount</label>
                <p className="text-2xl font-bold">₹{invoice.amount}</p>
              </div>
              {invoice.cashback && (
                <div>
                  <label className="text-sm font-medium">Cashback</label>
                  <p className="text-lg font-semibold text-green-600">
                    ₹{invoice.cashback.amount}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium">Submitted On</label>
                <p className="text-sm text-muted-foreground">
                  {new Date(invoice.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
