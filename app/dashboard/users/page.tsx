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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Eye, MoreHorizontal } from "lucide-react";
import useSWR from "swr";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface User {
  id: string;
  name: string | null;
  phoneNumber: string;
  balance: number;
  subscribe: boolean;
  referralCode: string;
  createdAt: string;
  avatarUrl: string | null;
  _count: {
    invoices: number;
    withdrawals: number;
    cashbacks: number;
  };
}

interface UsersResponse {
  users: User[];
  total: number;
  pages: number;
}

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data, error, isLoading } = useSWR<UsersResponse>(
    `/api/users?page=${currentPage}&limit=${limit}`,
    fetcher,
    {
      refreshInterval: 5000,
    }
  );

  if (error) return <div>Failed to load users</div>;
  if (isLoading || !data) return <div>Loading...</div>;

  const { users, total, pages } = data;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Total {total} user{total !== 1 ? "s" : ""} registered
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>Export Users</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Manage all registered users on the platform
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Referral Code</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={
                            user.avatarUrl ||
                            "/placeholder.svg?height=40&width=40"
                          }
                          alt={user.name || "User Avatar"}
                        />
                        <AvatarFallback>
                          {(user.name || "NA").substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">
                        {user.name || "Anonymous"}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>₹{user.balance}</TableCell>

                  <TableCell>
                    <Badge variant={user.subscribe ? "default" : "outline"}>
                      {user.subscribe ? "Subscribed" : "Not Subscribed"}
                    </Badge>
                  </TableCell>

                  <TableCell>{user.referralCode}</TableCell>

                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      <div>{user._count.invoices} invoices</div>
                      <div>{user._count.cashbacks} cashbacks</div>
                      <div>{user._count.withdrawals} withdrawals</div>
                    </div>
                  </TableCell>

                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
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
                          View user details
                        </DropdownMenuItem>
                        <DropdownMenuItem>View invoices</DropdownMenuItem>
                        <DropdownMenuItem>View cashbacks</DropdownMenuItem>
                        <DropdownMenuItem>View withdrawals</DropdownMenuItem>
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
