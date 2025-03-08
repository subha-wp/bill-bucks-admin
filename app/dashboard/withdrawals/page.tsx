import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Eye, MoreHorizontal, CheckCircle, XCircle } from "lucide-react"

export default function WithdrawalsPage() {
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
          <CardDescription>Manage all withdrawal requests from users</CardDescription>
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
              {withdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell className="font-medium">{withdrawal.id}</TableCell>
                  <TableCell>{withdrawal.user}</TableCell>
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
                  <TableCell>{withdrawal.date}</TableCell>
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
                        <DropdownMenuItem>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as completed
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// Sample data
const withdrawals = [
  {
    id: "WD-001",
    user: "Rahul Kumar",
    upiId: "rahul@okicici",
    amount: "500.00",
    status: "COMPLETED",
    date: "2023-03-15",
  },
  {
    id: "WD-002",
    user: "Ananya Patel",
    upiId: "ananya@okhdfc",
    amount: "1,200.00",
    status: "PENDING",
    date: "2023-03-14",
  },
  {
    id: "WD-003",
    user: "Vikram Singh",
    upiId: "vikram@oksbi",
    amount: "750.50",
    status: "REJECTED",
    date: "2023-03-13",
    notes: "Invalid UPI ID",
  },
  {
    id: "WD-004",
    user: "Priya Mehta",
    upiId: "priya@okaxis",
    amount: "2,000.00",
    status: "PENDING",
    date: "2023-03-12",
  },
  {
    id: "WD-005",
    user: "Arjun Kapoor",
    upiId: "arjun@okpaytm",
    amount: "1,500.00",
    status: "COMPLETED",
    date: "2023-03-11",
  },
]

