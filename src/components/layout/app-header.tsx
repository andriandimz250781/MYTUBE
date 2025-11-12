'use client';
import Link from 'next/link';
import { Search, Upload, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getImage } from '@/app/lib/data';
import { useRouter } from 'next/navigation';

export function AppHeader() {
  const router = useRouter();
  const userAvatar = getImage('user-avatar-1');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    router.push(`/search?query=${encodeURIComponent(query)}`);
  };


  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-semibold md:text-base"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7 text-primary"
        >
          <path d="M12.02 2.02c-5.52.02-10 4.5-10 10 0 4.51 3.01 8.32 7.15 9.54.52.1.72-.23.72-.51v-1.8c-2.92.64-3.54-1.41-3.54-1.41-.47-1.2-1.16-1.52-1.16-1.52-1-.68.07-.67.07-.67 1.1.08 1.68 1.13 1.68 1.13 1-.68 2.61-.48 3.25-.37.1-.29.4-.48.72-.6-2.48-.28-5.08-1.24-5.08-5.52 0-1.22.44-2.22 1.16-2.99-.11-.28-.5-1.41.11-2.95 0 0 .94-.3 3.08 1.15.89-.25 1.84-.37 2.79-.37s1.9.12 2.79.37c2.14-1.45 3.08-1.15 3.08-1.15.61 1.54.23 2.67.11 2.95.72.77 1.16 1.77 1.16 2.99 0 4.28-2.6 5.24-5.09 5.51.41.35.78 1.05.78 2.12v3.14c0 .28.2.61.73.51A10.01 10.01 0 0 0 22 12.02c0-5.5-4.48-9.98-10-10z" />
        </svg>

        <span className="hidden font-headline text-xl font-bold text-primary sm:inline">
          ANDTUBE
        </span>
      </Link>
      <div className="flex w-full items-center gap-4 md:gap-2 lg:gap-4">
        <form
          className="flex-1 sm:flex-initial"
          onSubmit={handleSearch}
        >
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              name="search"
              placeholder="Search videos..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="ghost" size="icon" className="hidden sm:flex">
            <Link href="/upload">
                <Upload className="h-5 w-5" />
                <span className="sr-only">Upload Video</span>
            </Link>
            </Button>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                    {userAvatar && (
                    <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" />
                    )}
                    <AvatarFallback>
                    <User className="h-5 w-5" />
                    </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
