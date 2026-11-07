'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { createSdk, type SdkInstance } from '@karasu-lab/sdk/client';
import type { ClientConfig } from './client-config';

export interface SdkContextValue {
  sdk: SdkInstance;
  config: ClientConfig;
}

const SdkContext = createContext<SdkContextValue | null>(null);

let clientConfigPromise: Promise<ClientConfig> | undefined;

function fetchClientConfig(): Promise<ClientConfig> {
  if (!clientConfigPromise) {
    clientConfigPromise = fetch('/api/client-config').then(async (response) => {
      if (!response.ok) throw new Error(`Failed to load the client configuration: ${response.status}`);
      return (await response.json()) as ClientConfig;
    });
    clientConfigPromise.catch(() => {
      clientConfigPromise = undefined;
    });
  }
  return clientConfigPromise;
}

export function SdkProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ClientConfig | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchClientConfig()
      .then((loaded) => {
        if (!cancelled) setConfig(loaded);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<SdkContextValue | null>(() => (config ? { sdk: createSdk(config), config } : null), [config]);

  if (error) throw error;

  if (!value) return null;

  return <SdkContext.Provider value={value}>{children}</SdkContext.Provider>;
}

export function useSdk(): SdkContextValue {
  const value = useContext(SdkContext);
  if (!value) throw new Error('useSdk must be used within an SdkProvider');
  return value;
}
