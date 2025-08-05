'use client';

import { useEffect } from 'react';
import { initDatadogRum } from '@/lib/datadog';

export default function DatadogProvider() {
  useEffect(() => {
    initDatadogRum();
  }, []);

  return null;
} 