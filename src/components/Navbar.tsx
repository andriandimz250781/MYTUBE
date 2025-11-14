import Link from 'next/link';
import { Video } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-semibold md:text-base"
      >
        <Video className="h-7 w-7 text-primary" />
        <span className="hidden font-bold text-xl text-primary sm:inline">
          ANDTUBE
        </span>
      </Link>
    </header>
  );
}
