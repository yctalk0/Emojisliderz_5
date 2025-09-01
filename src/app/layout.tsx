
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Card } from '@/components/ui/card';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'EmojiSliderz',
  description: 'A fun sliding puzzle game with emojis!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/assets/emoji/music/logo/logo.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background">
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          <footer className="w-full shrink-0">
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
