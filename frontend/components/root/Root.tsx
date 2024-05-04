'use client';
import { CurrentUserProvider } from '@/app/contexts/CurrentUserContext';
import React from 'react';

export default function Root({ children }: { children: React.ReactNode }) {
  return <CurrentUserProvider>{children}</CurrentUserProvider>;
}
