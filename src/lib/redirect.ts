import type { ClientConfig } from '@/lib/auth/client-config';

const OAUTH_SIGNATURE_PARAMS = ['sig', 'exp', 'prompt'];

export function getDefaultRedirectTo(config: ClientConfig): string {
  if (config.accountsUrl) return `${config.accountsUrl}/settings`;
  return config.appUrl ?? '/';
}

export function getRedirectTo(raw: string | null | undefined, config: ClientConfig): string {
  return resolveRedirectTo(raw, config.appEnv === 'preview' ? null : config.trustedOrigins, getDefaultRedirectTo(config));
}

export function getContinueTo(searchParams: URLSearchParams, config: ClientConfig): string {
  if (searchParams.get('sig') && searchParams.get('client_id')) {
    const params = new URLSearchParams();
    for (const [key, value] of searchParams.entries()) {
      if (!OAUTH_SIGNATURE_PARAMS.includes(key)) params.set(key, value);
    }
    return `${config.authApiUrl}/api/auth/oauth2/authorize?${params.toString()}`;
  }
  return getRedirectTo(searchParams.get('next'), config);
}

function matchesOriginPattern(origin: string, pattern: string): boolean {
  if (!pattern.includes('*')) return origin === pattern;
  const source = pattern
    .split('*')
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('[^/]*');
  return new RegExp(`^${source}$`).test(origin);
}

export function resolveRedirectTo(raw: string | null | undefined, trustedOrigins: readonly string[] | null, fallback: string): string {
  if (!raw) return fallback;

  if (raw.startsWith('/') && !raw.startsWith('//') && !raw.startsWith('/\\')) return raw;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return fallback;
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') return fallback;
  if (trustedOrigins && !trustedOrigins.some((pattern) => matchesOriginPattern(url.origin, pattern))) return fallback;
  return url.toString();
}
