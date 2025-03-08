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
import { Eye, MoreHorizontal, Download, CheckCircle, XCircle } from "lucide-react"

export default function InvoicesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
        <div className="flex items-center space-x-2">
          <Button>Download All</Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
          <CardDescription>Manage all invoice submissions from users</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.user}</TableCell>
                  <TableCell>{invoice.merchant}</TableCell>
                  <TableCell>₹{invoice.amount}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.isMerchant ? "default" : "secondary"}>
                      {invoice.isMerchant ? "Merchant" : "Non-Merchant"}
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download invoice
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
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
const invoices = [
  {
    id: "INV-001",
    user: "Rahul Kumar",
    merchant: "Reliance Fresh",
    amount: "1,999.00",
    status: "APPROVED",
    date: "2023-03-15",
    isMerchant: true,
  },
  {
    id: "INV-002",
    user: "Ananya Patel",
    merchant: "Big Bazaar",
    amount: "599.50",
    status: "PENDING",
    date: "2023-03-14",
    isMerchant: true,
  },
  {
    id: "INV-003",
    user: "Vikram Singh",
    merchant: "DMart",
    amount: "2,450.75",
    status: "REJECTED",
    date: "2023-03-13",
    isMerchant: true,
  },
  {
    id: "INV-004",
    user: "Priya Mehta",
    merchant: "N/A",
    amount: "1,200.00",
    status: "PENDING",
    date: "2023-03-12",
    isMerchant: false,
  },
  {
    id: "INV-005",
    user: "Arjun Kapoor",
    merchant: "More Supermarket",
    amount: "3,500.25",
    status: "APPROVED",
    date: "2023-03-11",
    isMerchant: true,
  },
]

