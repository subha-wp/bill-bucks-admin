import type React from "react";
import { MainNav } from "@/components/layout/main-nav";
import { UserNav } from "@/components/layout/user-nav";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <div className="">
          <div className="border-b w-full flex">
            <div className="container mx-auto flex h-16 items-center">
              <MainNav className="mx-6 " />
              <div className="ml-auto flex items-center space-x-4">
                <UserNav />
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
