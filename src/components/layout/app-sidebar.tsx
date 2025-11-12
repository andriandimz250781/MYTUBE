'use client';
import {
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';

export function AppSidebar() {
  return (
    <>
      <SidebarContent>
        {/* Sidebar content removed as requested */}
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} ANDTUBE
        </div>
      </SidebarFooter>
    </>
  );
}
