
"use client";

import './globals.css';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import ResponsiveLayout from '@/components/Layout';
import { ThemeProvider } from '@/components/theme-provider';
import ScrollToTop from '@/components/ScrollToTop';
import { VideoProvider, useVideo } from '@/components/video/VideoProvider';
import MiniPlayer from '@/components/video/MiniPlayer';
import { useEffect, useState } from 'react';
import type { Video } from '@/lib/youtube';
import { getVideoById } from '@/lib/youtube';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ['latin'] });

function AppContent({ children }: { children: React.ReactNode }) {
  const { floating, currentId } = useVideo();
  const [videoInfo, setVideoInfo] = useState<Video | null>(null);

  useEffect(() => {
    if (floating && currentId) {
      getVideoById(currentId).then(video => {
        if (video) {
          setVideoInfo(video);
        }
      });
    } else {
      setVideoInfo(null);
    }
  }, [floating, currentId]);

  return (
    <>
      <Navbar />
      <ResponsiveLayout>{children}</ResponsiveLayout>
      <ScrollToTop />
      {floating && videoInfo && (
         <MiniPlayer
            id={videoInfo.id}
            title={videoInfo.title}
            thumbnail={videoInfo.thumbnail}
        />
      )}
    </>
  );
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      (window as any).workbox !== undefined
    ) {
      const wb = (window as any).workbox;
      wb.active.then((worker: any) => {
        console.log('Service worker activated.');
      });

      // Add this to your page to register the service worker.
      // It will not be registered in development mode.
      wb.register(); 
    }
  }, []);
  
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
