import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  // The sidebar state is stored in a cookie, `sidebar_state`
  // so it persists across page loads.
  return (
    <SidebarProvider>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
        <div className="flex min-h-svh flex-col">
          <AppHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
