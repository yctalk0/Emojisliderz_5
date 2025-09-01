
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
      <body className="font-body antialiased flex flex-col min-h-screen bg-background">
        <div className="flex-grow">
          {children}
        </div>
        <footer className="w-full p-4">
            <Card className="max-w-md mx-auto h-20 flex items-center justify-center bg-secondary/50 border-dashed" style={{ position: 'relative', bottom: '7px' }}>
                <p className="text-muted-foreground">Advertisement</p>
            </Card>
            <div className="max-w-md mx-auto h-[5px] bg-secondary/50 mt-1 rounded-md"></div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
