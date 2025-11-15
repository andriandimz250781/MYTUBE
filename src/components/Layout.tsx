import React from 'react';

// Responsive Layout Wrapper
export default function ResponsiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full max-w-5xl mx-auto px-3 md:px-6 lg:px-8 py-4">
      {children}
    </main>
  );
}

// Helper Component for Section Title
export function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-lg md:text-xl font-semibold mb-4 mt-2 text-foreground">
      {title}
    </h2>
  );
}

// Helper Component for Page Container
export function PageContainer({ children }: { children: React.ReactNode }) {
  return <div className="w-full flex flex-col gap-4 pb-10">{children}</div>;
}

// Helper: Card Wrapper (Auto Resize for HP, Tablet, Laptop, TV)
export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-card text-card-foreground border border-border rounded-xl p-3 md:p-4 shadow-sm hover:bg-muted transition">
      {children}
    </div>
  );
}

// Video Thumbnail Wrapper (16:9 Responsive)
export function VideoThumbnail({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted">
      <img
        src={src}
        alt={alt}
        className="absolute w-full h-full object-cover"
      />
    </div>
  );
}

// Auto Text Sizes for All Devices
export function AutoText({ children }: { children: React.ReactNode }) {
  return <div className="text-sm md:text-base lg:text-lg">{children}</div>;
}
