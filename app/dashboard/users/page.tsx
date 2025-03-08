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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Eye, MoreHorizontal } from "lucide-react"

export default function UsersPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <div className="flex items-center space-x-2">
          <Button>Export Users</Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage all registered users on the platform</CardDescription>
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
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
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
                  <TableCell>{user.createdAt}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  )
}

// Sample data
const users = [
  {
    id: "user-001",
    name: "Rahul Kumar",
    phoneNumber: "+91 9876543210",
    balance: "1,250.50",
    subscribe: true,
    referralCode: "RAHUL123",
    createdAt: "2023-01-15",
    avatarUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user-002",
    name: "Ananya Patel",
    phoneNumber: "+91 9876543211",
    balance: "750.25",
    subscribe: false,
    referralCode: "ANANYA456",
    createdAt: "2023-01-20",
    avatarUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user-003",
    name: "Vikram Singh",
    phoneNumber: "+91 9876543212",
    balance: "2,500.00",
    subscribe: true,
    referralCode: "VIKRAM789",
    createdAt: "2023-02-05",
    avatarUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user-004",
    name: "Priya Mehta",
    phoneNumber: "+91 9876543213",
    balance: "1,800.75",
    subscribe: true,
    referralCode: "PRIYA101",
    createdAt: "2023-02-10",
    avatarUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user-005",
    name: "Arjun Kapoor",
    phoneNumber: "+91 9876543214",
    balance: "3,200.25",
    subscribe: false,
    referralCode: "ARJUN202",
    createdAt: "2023-02-15",
    avatarUrl: "/placeholder.svg?height=40&width=40",
  },
]

