import type React from "react";
import { MainNav } from "@/components/layout/main-nav";
import { UserNav } from "@/components/layout/user-nav";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <div className="min-h-screen w-full">
        <div className="border-b w-full flex">
          <div className="container mx-auto flex h-16 items-center">
            <MainNav className="mx-6 " />
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </div>
        <div className="p-4 pl-12 w-full">{children}</div>
      </div>
    </SidebarProvider>
  );
}
