"use client";

import Link from 'next/link';
import { Search, Video } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from './ui/button';
import { ThemeToggle } from './theme-toggle';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;
      // Hide navbar only if scrolling down and past the navbar's height
      setHidden(isScrollingDown && currentScrollY > 80);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm transition-transform duration-300 md:px-6",
      hidden ? "-translate-y-full" : "translate-y-0"
    )}>
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-semibold text-primary"
      >
        <Video className="h-7 w-7" />
        <span className="hidden font-bold sm:inline-block">ANDTUBE</span>
      </Link>

      <div className="flex flex-1 justify-center px-4 md:px-8 lg:px-16">
        <form action="/search" className="relative w-full max-w-lg">
          <Input
            type="search"
            name="q"
            placeholder="Search videos..."
            className="h-auto w-full rounded-full border-2 border-border bg-transparent py-3 pl-5 pr-12 text-base"
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full"
            aria-label="Search"
          >
            <Search className="h-5 w-5 text-muted-foreground" />
          </Button>
        </form>
      </div>

      <div className="flex items-center">
        <ThemeToggle />
      </div>
    </header>
  );
}
