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
import { Eye, MoreHorizontal, Edit, Trash } from "lucide-react"

export default function MerchantsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Merchants</h2>
        <div className="flex items-center space-x-2">
          <Button>Add Merchant</Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Merchants</CardTitle>
          <CardDescription>Manage all merchants on the platform</CardDescription>
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
              {merchants.map((merchant) => (
                <TableRow key={merchant.id}>
                  <TableCell className="font-medium">{merchant.name}</TableCell>
                  <TableCell>{merchant.address}</TableCell>
                  <TableCell>{merchant.city}</TableCell>
                  <TableCell>{merchant.phone}</TableCell>
                  <TableCell>{merchant.cashbackAmount}%</TableCell>
                  <TableCell>{merchant.createdAt}</TableCell>
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
                          <Edit className="mr-2 h-4 w-4" />
                          Edit merchant
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash className="mr-2 h-4 w-4" />
                          Delete merchant
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
const merchants = [
  {
    id: "merchant-001",
    name: "Reliance Fresh",
    address: "123 Main Street",
    city: "Mumbai",
    phone: "+91 2234567890",
    cashbackAmount: "3.00",
    createdAt: "2023-01-10",
  },
  {
    id: "merchant-002",
    name: "Big Bazaar",
    address: "456 Market Road",
    city: "Delhi",
    phone: "+91 2234567891",
    cashbackAmount: "2.50",
    createdAt: "2023-01-15",
  },
  {
    id: "merchant-003",
    name: "DMart",
    address: "789 Shopping Lane",
    city: "Bangalore",
    phone: "+91 2234567892",
    cashbackAmount: "3.00",
    createdAt: "2023-01-20",
  },
  {
    id: "merchant-004",
    name: "More Supermarket",
    address: "101 Retail Park",
    city: "Chennai",
    phone: "+91 2234567893",
    cashbackAmount: "3.50",
    createdAt: "2023-02-05",
  },
  {
    id: "merchant-005",
    name: "Spencer's",
    address: "202 Commerce Street",
    city: "Hyderabad",
    phone: "+91 2234567894",
    cashbackAmount: "2.75",
    createdAt: "2023-02-10",
  },
]

