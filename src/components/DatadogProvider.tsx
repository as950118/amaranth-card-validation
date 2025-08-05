'use client';

import { useEffect, useRef } from 'react';
import { initDatadogRum } from '@/lib/datadog';

export default function DatadogProvider() {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initDatadogRum();
      initialized.current = true;
    }
  }, []);

  return null;
} 