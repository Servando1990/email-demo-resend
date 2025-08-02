'use client';

import { useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import { seedDemoData } from '@/lib/seedData';

export default function Home() {
  useEffect(() => {
    seedDemoData();
  }, []);

  return <Dashboard />;
}