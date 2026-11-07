'use client';

import { useEffect } from 'react';

/** Sends the root path to the sign-in page, carrying the query string over. */
export function RootRedirectClient() {
  useEffect(() => {
    window.location.replace(`/sign-in${window.location.search}`);
  }, []);

  return null;
}
