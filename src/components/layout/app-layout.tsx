import { AppHeader } from '@/components/layout/app-header';
import { CategoryBar } from './category-bar';
import { Suspense } from 'react';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />
      <Suspense fallback={null}>
        <CategoryBar />
      </Suspense>
      <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
    </div>
  );
}
