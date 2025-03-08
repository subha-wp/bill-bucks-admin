import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Transaction {
  id: string;
  amount: number;
  user: {
    name: string;
    phoneNumber: string;
    avatarUrl?: string;
  };
}

interface RecentSalesProps {
  transactions?: Transaction[];
}

export function RecentSales({ transactions = [] }: RecentSalesProps) {
  return (
    <div className="space-y-8">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={
                transaction.user.avatarUrl ||
                "/placeholder.svg?height=36&width=36"
              }
              alt={transaction.user.name || ""}
            />
            <AvatarFallback>
              {(transaction.user.name || "").substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {transaction.user.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {transaction.user.phoneNumber}
            </p>
          </div>
          <div className="ml-auto font-medium">
            +₹{transaction.amount.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
