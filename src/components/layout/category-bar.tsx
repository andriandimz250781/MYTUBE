'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

const categories = [
  'BERANDA',
  'MUSIK',
  'KARAOKE',
  'BERITA',
  'FILM',
  'KARTUN',
  'HOROR',
  'LIVE',
  'KULINER',
  'HOBBY',
  'KOMEDI',
];

export function CategoryBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('query')?.toUpperCase() || 'BERANDA';

  const handleCategoryClick = (category: string) => {
    if (category === 'BERANDA') {
      router.push('/');
    } else {
      router.push(`/search?query=${encodeURIComponent(category)}`);
    }
  };

  return (
    <div className="border-b bg-background/95 backdrop-blur-sm">
      <div className="flex items-center gap-2 overflow-x-auto px-4 py-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            className={cn(
              'rounded-full px-4 py-1 h-auto text-sm transition-colors shrink-0',
              selectedCategory === category
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
