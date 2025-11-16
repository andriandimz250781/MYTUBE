
"use client";

import Link from 'next/link';
import { History, Search, Tv, Video, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from './ui/button';
import { ThemeToggle } from './theme-toggle';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      // Don't hide navbar if searching
      if (isSearching) {
          setHidden(false);
          return;
      }
      const isScrollingDown = currentScrollY > lastScrollY;
      setHidden(isScrollingDown && currentScrollY > 80);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isSearching]);

  // Focus input when search mode is activated
  useEffect(() => {
    if (isSearching) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearching]);

  return (
    <header className={cn(
      "sticky top-0 z-10 flex h-16 items-center justify-between gap-x-4 border-b bg-background/80 px-4 backdrop-blur-sm transition-transform duration-300 md:px-6",
      hidden ? "-translate-y-full" : "translate-y-0"
    )}>

      {/* SEARCHING VIEW (Mobile) */}
      {isSearching ? (
        <div className="flex w-full items-center gap-2 md:hidden">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearching(false)}
                aria-label="Back"
            >
                <ArrowLeft className="h-6 w-6" />
            </Button>
            <form action="/search" className="relative w-full">
                <Input
                    ref={searchInputRef}
                    type="search"
                    name="q"
                    placeholder="Search videos..."
                    className="h-auto w-full rounded-full border-2 border-border bg-transparent py-2 pl-4 pr-12 text-base"
                />
                <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full"
                    aria-label="Search"
                >
                    <Search className="h-5 w-5 text-muted-foreground" />
                </Button>
            </form>
        </div>
      ) : (
        <>
            {/* DEFAULT VIEW */}
            <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold text-primary"
            >
                <Video className="h-7 w-7" />
                <span className="hidden font-bold sm:inline-block">ANDTUBE</span>
            </Link>

            {/* Desktop Search */}
            <div className="hidden flex-1 justify-center md:flex md:px-8 lg:px-16">
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

            <div className="flex items-center gap-0 md:gap-2">
                <TooltipProvider>
                    {/* Mobile Search Trigger */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearching(true)}>
                                <Search className="h-5 w-5" />
                                <span className="sr-only">Search</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Search</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" asChild>
                        <Link href="/history">
                            <History className="h-5 w-5" />
                            <span className="sr-only">Watch History</span>
                        </Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Watch History</p>
                    </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" asChild>
                        <Link href="/tv">
                            <Tv className="h-5 w-5" />
                            <span className="sr-only">TV Mode</span>
                        </Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>TV Mode</p>
                    </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <ThemeToggle />
            </div>
        </>
      )}
    </header>
  );
}
