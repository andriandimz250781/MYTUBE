'use client';
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, History, User, Upload } from 'lucide-react';

export function AppSidebar() {
  const pathname = usePathname();
  const myChannelPath = '/channel/techflow'; // Hardcoded for now

  return (
    <>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/'}
              tooltip="Home"
            >
              <Link href="/">
                <Home />
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/history'}
              tooltip="History"
            >
              <Link href="/history">
                <History />
                <span>History</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator />

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === myChannelPath}
              tooltip="My Channel"
            >
              <Link href={myChannelPath}>
                <User />
                <span>My Channel</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/upload'}
              tooltip="Upload"
            >
              <Link href="/upload">
                <Upload />
                <span>Upload</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} ANDTUBE
        </div>
      </SidebarFooter>
    </>
  );
}
