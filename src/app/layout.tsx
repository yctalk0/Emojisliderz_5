
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Card } from '@/components/ui/card';

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background">
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow pb-28">
            {children}
          </main>
          <footer className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-background/80 backdrop-blur-sm">
              <Card className="max-w-md mx-auto h-20 flex items-center justify-center bg-secondary/50 border-dashed">
                  <p className="text-muted-foreground">Advertisement</p>
              </Card>
              <div className="max-w-md mx-auto h-[5px] bg-secondary/50 mt-1 rounded-md"></div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
