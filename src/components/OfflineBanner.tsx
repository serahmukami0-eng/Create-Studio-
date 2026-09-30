import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-16 inset-x-0 z-50 bg-amber-500/95 text-black px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 shadow-lg backdrop-blur-md">
      <WifiOff className="w-4 h-4 animate-pulse" />
      <span>Android Offline Mode: You are offline. Cached tools, pricing calculator, and saved commissions remain accessible.</span>
    </div>
  );
};
