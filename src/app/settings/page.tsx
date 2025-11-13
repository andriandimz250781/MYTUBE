'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';


function SettingsContent() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="font-headline text-3xl font-bold">Settings</h1>
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Halaman Tidak Tersedia</AlertTitle>
          <AlertDescription>
              Halaman pengaturan tidak lagi digunakan.
          </AlertDescription>
      </Alert>
        <Button asChild variant="outline">
          <Link href="/">Kembali ke Beranda</Link>
      </Button>
      </div>
  );
}


export default function SettingsPage() {
  return (
    <Suspense fallback={<div>Memuat pengaturan...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
