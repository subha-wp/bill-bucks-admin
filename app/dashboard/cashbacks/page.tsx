import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Eye, MoreHorizontal, Download } from "lucide-react"

export default function CashbacksPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Cashbacks</h2>
        <div className="flex items-center space-x-2">
          <Button>Export Data</Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Cashbacks</CardTitle>
          <CardDescription>View and manage all cashbacks issued to users</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cashback ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cashbacks.map((cashback) => (
                <TableRow key={cashback.id}>
                  <TableCell className="font-medium">{cashback.id}</TableCell>
                  <TableCell>{cashback.user}</TableCell>
                  <TableCell>{cashback.invoiceId}</TableCell>
                  <TableCell>₹{cashback.amount}</TableCell>
                  <TableCell>
                    <Badge variant={cashback.type === "MERCHANT" ? "default" : "secondary"}>{cashback.type}</Badge>
                  </TableCell>
                  <TableCell>{cashback.date}</TableCell>
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
                          Export data
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
const cashbacks = [
  {
    id: "CB-001",
    user: "Rahul Kumar",
    invoiceId: "INV-001",
    amount: "59.97",
    type: "MERCHANT",
    date: "2023-03-15",
  },
  {
    id: "CB-002",
    user: "Ananya Patel",
    invoiceId: "INV-002",
    amount: "17.99",
    type: "MERCHANT",
    date: "2023-03-14",
  },
  {
    id: "CB-003",
    user: "Vikram Singh",
    invoiceId: "INV-003",
    amount: "73.52",
    type: "MERCHANT",
    date: "2023-03-13",
  },
  {
    id: "CB-004",
    user: "Priya Mehta",
    invoiceId: "INV-004",
    amount: "120.00",
    type: "NON_MERCHANT",
    date: "2023-03-12",
  },
  {
    id: "CB-005",
    user: "Arjun Kapoor",
    invoiceId: "INV-005",
    amount: "105.01",
    type: "MERCHANT",
    date: "2023-03-11",
  },
]

