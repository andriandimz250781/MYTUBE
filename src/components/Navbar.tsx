import Link from 'next/link';
import { Search, Video } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-semibold"
      >
        <Video className="h-7 w-7 text-primary" />
        <span className="hidden font-bold text-lg md:text-xl text-primary sm:inline">
          ANDTUBE
        </span>
      </Link>

      <div className="flex flex-1 justify-center px-4 md:px-8 lg:px-16">
        <div className="relative w-full max-w-lg">
          <Input
            type="search"
            placeholder="Search videos..."
            className="h-10 w-full rounded-full pl-10 pr-4 text-sm md:text-base"
          />
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
