
'use client';

import ClientOnly from '@/components/client-only'; // Force re-evaluation
import GamePage from '@/components/GamePage';

export default function Home() {
  return (
    <ClientOnly>
      <GamePage />
    </ClientOnly>
  );
}
