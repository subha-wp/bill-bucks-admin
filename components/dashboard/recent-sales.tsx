import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>RK</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Rahul Kumar</p>
          <p className="text-sm text-muted-foreground">rahul.kumar@example.com</p>
        </div>
        <div className="ml-auto font-medium">+₹1,999.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>AP</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Ananya Patel</p>
          <p className="text-sm text-muted-foreground">ananya@example.com</p>
        </div>
        <div className="ml-auto font-medium">+₹39.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>VS</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Vikram Singh</p>
          <p className="text-sm text-muted-foreground">vikram.singh@example.com</p>
        </div>
        <div className="ml-auto font-medium">+₹299.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>PM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Priya Mehta</p>
          <p className="text-sm text-muted-foreground">priya@example.com</p>
        </div>
        <div className="ml-auto font-medium">+₹99.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>AK</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Arjun Kapoor</p>
          <p className="text-sm text-muted-foreground">arjun@example.com</p>
        </div>
        <div className="ml-auto font-medium">+₹2,499.00</div>
      </div>
    </div>
  )
}

