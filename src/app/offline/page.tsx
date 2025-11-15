"use client"

import { WifiOff } from 'lucide-react';
import { PageContainer } from '@/components/Layout';

export default function OfflinePage() {
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center text-center text-muted-foreground gap-6 py-20">
        <WifiOff className="w-20 h-20" />
        <h1 className="text-3xl font-bold text-foreground">You are offline</h1>
        <p className="max-w-md">
          It looks like you've lost your connection. Please check your network and try again. Previously visited pages might be available.
        </p>
      </div>
    </PageContainer>
  );
}