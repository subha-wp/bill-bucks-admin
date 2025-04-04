import type React from "react";
import { MainNav } from "@/components/layout/main-nav";
import { UserNav } from "@/components/layout/user-nav";
import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 transition-all duration-300">
          <div className="border-b">
            <div className="flex h-16 items-center px-4 ">
              <SidebarTrigger className="mr-2 z-20" />
              <MainNav className="mx-6" />
              <div className="ml-auto flex items-center space-x-4">
                <UserNav />
              </div>
            </div>
          </div>
          <div className="p-4 pl-12 w-full">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
