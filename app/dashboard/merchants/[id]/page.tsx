/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle, MoreHorizontal } from "lucide-react";

interface BillingCycle {
  id: string;
  startDate: Date;
  endDate: Date;
  totalInvoices: number;
  totalAmount: number;
  totalCashback: number;
  serviceCharge: number;
  status: "PENDING" | "PAID" | "OVERDUE";
}

interface MerchantReport {
  merchant: {
    id: string;
    name: string;
    address: string;
    phone: string;
    cashbackAmount: number;
    status: "ACTIVE" | "SUSPENDED";
  };
  currentCycle: BillingCycle;
  previousCycles: BillingCycle[];
  recentInvoices: any[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MerchantReportPage() {
  const params = useParams();
  const merchantId = params.id as string;

  const { data, error, isLoading, mutate } = useSWR<MerchantReport>(
    `/api/merchants/${merchantId}/report`,
    fetcher,
    {
      refreshInterval: 5000,
    }
  );

  const updateMerchantStatus = async (status: "ACTIVE" | "SUSPENDED") => {
    try {
      const response = await fetch(`/api/merchants/${merchantId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update merchant status");
      }

      toast({
        title: "Success",
        description: `Merchant ${status.toLowerCase()} successfully`,
      });

      mutate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update merchant status",
        variant: "destructive",
      });
    }
  };

  const updateBillingCycle = async (
    cycleId: string,
    status: "PAID" | "PENDING" | "OVERDUE"
  ) => {
    try {
      const response = await fetch(
        `/api/merchants/${merchantId}/billing/${cycleId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update billing cycle");
      }

      toast({
        title: "Success",
        description: `Billing cycle marked as ${status.toLowerCase()}`,
      });

      mutate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update billing cycle",
        variant: "destructive",
      });
    }
  };

  if (error) return <div>Failed to load merchant report</div>;
  if (isLoading) return <div>Loading...</div>;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {data?.merchant.name} - Report
          </h2>
          <p className="text-muted-foreground">
            Status:{" "}
            <Badge
              variant={
                data?.merchant.status === "ACTIVE" ? "success" : "destructive"
              }
            >
              {data?.merchant.status}
            </Badge>
          </p>
        </div>
        <Button
          variant={
            data?.merchant.status === "ACTIVE" ? "destructive" : "default"
          }
          onClick={() =>
            updateMerchantStatus(
              data?.merchant.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE"
            )
          }
        >
          {data?.merchant.status === "ACTIVE" ? (
            <>
              <AlertCircle className="mr-2 h-4 w-4" />
              Suspend Merchant
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Activate Merchant
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Cycle Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data?.currentCycle.totalAmount || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDate(data?.currentCycle.startDate || new Date())} -{" "}
              {formatDate(data?.currentCycle.endDate || new Date())}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cashback Issued
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data?.currentCycle.totalCashback || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Current billing cycle
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Service Charge (3%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data?.currentCycle.serviceCharge || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Due by {formatDate(data?.currentCycle.endDate || new Date())}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing Cycles</CardTitle>
          <CardDescription>
            View all billing cycles and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Total Invoices</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Cashback</TableHead>
                <TableHead>Service Charge</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[data?.currentCycle, ...(data?.previousCycles || [])].map(
                (cycle) => (
                  <TableRow key={cycle.id}>
                    <TableCell>
                      {formatDate(cycle.startDate)} -{" "}
                      {formatDate(cycle.endDate)}
                    </TableCell>
                    <TableCell>{cycle.totalInvoices}</TableCell>
                    <TableCell>{formatCurrency(cycle.totalAmount)}</TableCell>
                    <TableCell>{formatCurrency(cycle.totalCashback)}</TableCell>
                    <TableCell>{formatCurrency(cycle.serviceCharge)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          cycle.status === "PAID"
                            ? "success"
                            : cycle.status === "OVERDUE"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {cycle.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => updateBillingCycle(cycle.id, "PAID")}
                          >
                            Mark as Paid
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateBillingCycle(cycle.id, "PENDING")
                            }
                          >
                            Mark as Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() =>
                              updateBillingCycle(cycle.id, "OVERDUE")
                            }
                          >
                            Mark as Overdue
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>Last 15 days of invoice activity</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Cashback</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.recentInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.user.name}</TableCell>
                  <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                  <TableCell>
                    {formatCurrency(invoice.cashback?.amount || 0)}
                  </TableCell>
                  <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        invoice.status === "APPROVED"
                          ? "success"
                          : invoice.status === "REJECTED"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
