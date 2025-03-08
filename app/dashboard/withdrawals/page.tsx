/* eslint-disable @typescript-eslint/no-explicit-any */
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Eye, MoreHorizontal, CheckCircle, XCircle } from "lucide-react";
import useSWR from "swr";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function WithdrawalsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data, error, isLoading, mutate } = useSWR(
    `/api/withdrawals?page=${currentPage}&limit=${limit}`,
    fetcher,
    {
      refreshInterval: 5000,
    }
  );

  const updateWithdrawalStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/withdrawals/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update withdrawal status");
      }

      toast({
        title: "Success",
        description: `Withdrawal ${status.toLowerCase()} successfully`,
      });

      // Refresh the data
      mutate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update withdrawal status",
        variant: "destructive",
      });
    }
  };

  if (error) return <div>Failed to load withdrawals</div>;
  if (isLoading) return <div>Loading...</div>;

  const { withdrawals, total, pages } = data;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Withdrawals</h2>
        <div className="flex items-center space-x-2">
          <Button>Export Data</Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Withdrawals</CardTitle>
          <CardDescription>
            Manage all withdrawal requests from users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Withdrawal ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>UPI ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals?.map((withdrawal: any) => (
                <TableRow key={withdrawal.id}>
                  <TableCell className="font-medium">{withdrawal.id}</TableCell>
                  <TableCell>{withdrawal.user.name}</TableCell>
                  <TableCell>{withdrawal.upiId}</TableCell>
                  <TableCell>₹{withdrawal.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        withdrawal.status === "COMPLETED"
                          ? "success"
                          : withdrawal.status === "PENDING"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {withdrawal.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(withdrawal.createdAt).toLocaleDateString()}
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {withdrawal.status === "PENDING" && (
                          <>
                            <DropdownMenuItem
                              onClick={() =>
                                updateWithdrawalStatus(
                                  withdrawal.id,
                                  "COMPLETED"
                                )
                              }
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as completed
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateWithdrawalStatus(
                                  withdrawal.id,
                                  "REJECTED"
                                )
                              }
                              className="text-destructive"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={
                      currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < pages) setCurrentPage(currentPage + 1);
                    }}
                    className={
                      currentPage >= pages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
