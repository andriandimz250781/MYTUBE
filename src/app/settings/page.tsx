'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { YOUTUBE_API_KEYS } from '@/config/apiKeys';
import { KeyRound, Info, RefreshCw, ShieldAlert, UserCog } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Suspense, useState, useEffect } from 'react';

const maskApiKey = (key: string) => {
  if (key.length <= 8) return '****';
  return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
};

function AdminRegistration({ onRegister }: { onRegister: () => void }) {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim()) {
      localStorage.setItem('adminPhoneNumber', phoneNumber.trim());
      alert('Nomor HP admin berhasil didaftarkan!');
      onRegister();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar sebagai Admin</CardTitle>
        <CardDescription>
          Masukkan nomor HP Anda untuk menjadi admin. Fitur ini hanya dapat
          digunakan satu kali.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleRegister}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Nomor HP</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="081234567890"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            <UserCog className="mr-2" />
            Daftar Admin
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function AdminLogin({ onLogin }: { onLogin: (success: boolean) => void }) {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPhone = localStorage.getItem('adminPhoneNumber');
    if (phoneNumber.trim() === storedPhone) {
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      onLogin(true);
    } else {
      alert('Nomor HP salah!');
      onLogin(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login Admin</CardTitle>
        <CardDescription>
          Masukkan nomor HP admin untuk mengakses halaman pengaturan.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Nomor HP</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Masukkan nomor HP terdaftar"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function AdminSettingsContent() {
  return (
    <>
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Informasi Kuota</AlertTitle>
        <AlertDescription>
          Halaman ini hanya menampilkan kunci API yang terkonfigurasi. API
          YouTube tidak menyediakan cara untuk memantau sisa kuota secara
          real-time dari aplikasi. Pemantauan hanya dapat dilakukan melalui
          Google Cloud Console.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Konfigurasi Kunci API YouTube</CardTitle>
          <CardDescription>
            Berikut adalah daftar kunci API yang digunakan aplikasi untuk
            mengambil data dari YouTube. Aplikasi akan secara otomatis beralih
            ke kunci berikutnya jika kuota harian habis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 rounded-md border p-4">
            {YOUTUBE_API_KEYS.map((key, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <KeyRound className="h-5 w-5 text-muted-foreground" />
                  <div className="font-mono text-sm">
                    <span className="text-muted-foreground">Kunci {index + 1}:</span>{' '}
                    <span className="font-semibold">{maskApiKey(key)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Button asChild variant="outline">
              <Link href="/">Kembali</Link>
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button disabled>
                    <RefreshCw className="mr-2" />
                    Reset Kuota
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset kuota tidak dapat dilakukan dari aplikasi.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function SettingsContent() {
  const searchParams = useSearchParams();
  const isAdminRoute = searchParams.get('admin') === 'true';

  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const adminPhone = localStorage.getItem('adminPhoneNumber');
    setIsRegistered(!!adminPhone);
    
    const sessionAuth = sessionStorage.getItem('isAdminAuthenticated');
    setIsAuthenticated(sessionAuth === 'true');

    setHasCheckedStorage(true);
  }, []);

  if (!hasCheckedStorage) {
    return <div>Memeriksa status admin...</div>;
  }
  
  if (!isAdminRoute) {
    return (
       <div className="mx-auto max-w-2xl space-y-8">
        <h1 className="font-headline text-3xl font-bold">Settings</h1>
         <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Halaman Tidak Ditemukan</AlertTitle>
            <AlertDescription>
                Halaman pengaturan umum tidak tersedia.
            </AlertDescription>
        </Alert>
         <Button asChild variant="outline">
            <Link href="/">Kembali ke Beranda</Link>
        </Button>
       </div>
    );
  }

  // Admin route logic
  if (isAuthenticated) {
    return (
      <div className="mx-auto max-w-2xl space-y-8">
        <h1 className="font-headline text-3xl font-bold">Admin Settings</h1>
        <AdminSettingsContent />
      </div>
    );
  }

  if (isRegistered) {
    return (
      <div className="mx-auto max-w-2xl space-y-8">
        <AdminLogin onLogin={setIsAuthenticated} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <AdminRegistration onRegister={() => {
        setIsRegistered(true);
        setIsAuthenticated(true); // Auto-login after registration
      }} />
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
