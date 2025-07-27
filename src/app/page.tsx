'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // This should rarely be hit due to middleware, but serves as a fallback
    router.replace('/en');
  }, [router]);

  // Show a minimal loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
          <span className="text-2xl">🧁</span>
        </div>
        <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Swispy
        </div>
        <div className="mt-2 text-gray-500">Loading...</div>
      </div>
    </div>
  );
}