
'use client';

import ClientOnly from '@/components/client-only';
import GamePage from '@/components/game-page';

export default function Home() {
  return (
    <ClientOnly>
      <GamePage />
    </ClientOnly>
  );
}
