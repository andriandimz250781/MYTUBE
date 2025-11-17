
"use client";

import './globals.css';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import ResponsiveLayout from '@/components/Layout';
import { ThemeProvider } from '@/components/theme-provider';
import ScrollToTop from '@/components/ScrollToTop';
import { VideoProvider } from '@/components/video/VideoProvider';
import MiniPlayer from '@/components/video/MiniPlayer';
import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { usePathname, useRouter } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

function isTV() {
  if (typeof window === "undefined") return false;
  // A robust check for TV user agents
  return /Android TV|SmartTV|TV|BRAVIA|AFTMM|AOSP on IA Emulator|HbbTV/i.test(navigator.userAgent);
}

function AppContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Redirect to /tv if a TV device is detected and we are not already in TV mode
    if (isTV() && !pathname.startsWith('/tv')) {
      router.replace('/tv');
    }
  }, [pathname, router]);

  // Hide Navbar and standard layout on TV page
  if (pathname.startsWith('/tv')) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <ResponsiveLayout>{children}</ResponsiveLayout>
      <ScrollToTop />
      <MiniPlayer />
    </>
  );
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
        const wb = (window as any).workbox;
        if (wb) {
            wb.register();
        }
    }
  }, []);
  
  if (pathname.startsWith('/tv')) {
    return (
       <html lang="en" suppressHydrationWarning>
         <body className={`${inter.className} bg-black`}>
           <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
              <VideoProvider>
                <AppContent>{children}</AppContent>
              </VideoProvider>
              <Toaster />
           </ThemeProvider>
         </body>
       </html>
    )
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
          <title>ANDTUBE</title>
          <meta name="description" content="A modern video platform." />
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />

          <meta name="application-name" content="ANDTUBE" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="ANDTUBE" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-config" content="/icons/browserconfig.xml" />
          <meta name="msapplication-TileColor" content="#1E3A8A" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#0F172A" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <VideoProvider>
            <AppContent>{children}</AppContent>
          </VideoProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
