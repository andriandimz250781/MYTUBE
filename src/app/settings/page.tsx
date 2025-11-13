import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { YOUTUBE_API_KEYS } from '@/config/apiKeys';
import { KeyRound, Info, RefreshCw } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Fungsi untuk menyamarkan sebagian kunci API demi keamanan
const maskApiKey = (key: string) => {
  if (key.length <= 8) {
    return '****';
  }
  return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
};

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="font-headline text-3xl font-bold">Settings</h1>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Informasi Kuota</AlertTitle>
        <AlertDescription>
          Halaman ini hanya menampilkan kunci API yang terkonfigurasi. API YouTube tidak menyediakan cara untuk memantau sisa kuota secara real-time dari aplikasi. Pemantauan hanya dapat dilakukan melalui Google Cloud Console.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Konfigurasi Kunci API YouTube</CardTitle>
          <CardDescription>
            Berikut adalah daftar kunci API yang digunakan aplikasi untuk mengambil data dari YouTube. Aplikasi akan secara otomatis beralih ke kunci berikutnya jika kuota harian habis.
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
                  {/* Tombol sengaja dinonaktifkan */}
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
    </div>
  );
}
