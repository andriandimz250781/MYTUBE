'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';

const categories = [
  'All',
  'Music',
  'Gaming',
  'News',
  'Sports',
  'Travel',
  'Cooking',
];

export function CategoryBar() {
  const router = useRouter();
  const pathname = usePathname();

  // A simple way to determine the active category for the demo
  const activeCategory =
    pathname === '/'
      ? 'All'
      : categories.find(c => pathname.includes(c.toLowerCase())) || 'All';

  const handleCategoryClick = (category: string) => {
    if (category === 'All') {
      router.push('/');
    } else {
      router.push(`/search?query=${category}`);
    }
  };

  return (
    <div className="border-b bg-background/95 backdrop-blur-sm">
      <div className="flex items-center gap-2 overflow-x-auto px-4 py-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={activeCategory === category ? 'default' : 'outline'}
            className={cn(
              'rounded-full px-4 py-1 h-auto text-sm transition-colors shrink-0',
              activeCategory === category
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
}
