import { z } from 'zod';

const PRODUCTION_DEFAULTS = {
  authApiUrl: 'https://api-auth.karasu256.com',
  authUrl: 'https://auth.karasu256.com',
  accountsUrl: 'https://accounts.karasu256.com',
  appUrl: 'https://karasu256.com',
  turnstileSiteKey: '0x4AAAAAAFsX0TpFOyokXFPm',
  trustedOrigins: [
    'https://accounts.karasu256.com',
    'https://auth.karasu256.com',
    'https://sso.karasu256.com',
    'https://karasu256.com',
    'https://qr.karasu256.com',
  ],
};

const PREVIEW_DEFAULTS = {
  authApiUrl: 'https://dev-api-auth.karasu256.com',
  authUrl: 'https://dev-auth.karasu256.com',
  accountsUrl: 'https://dev.accounts.karasu256.com',
  appUrl: 'https://dev.karasu256.com',
  turnstileSiteKey: '0x4AAAAAAFsX0TpFOyokXFPm',
  trustedOrigins: [
    'https://dev.accounts.karasu256.com',
    'https://dev-auth.karasu256.com',
    'https://dev-sso.karasu256.com',
    'https://dev.karasu256.com',
    'https://dev.qr.karasu256.com',
  ],
};

const LOCAL_DEFAULTS = {
  authApiUrl: 'http://localhost:8790',
  authUrl: 'http://localhost:3004',
  accountsUrl: 'http://localhost:3001',
  appUrl: 'http://localhost:3000',
  turnstileSiteKey: '0x4AAAAAAFsX0TpFOyokXFPm',
  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3004',
    'http://localhost:3007',
    'https://local.karasu256.com',
    'https://local-accounts.karasu256.com',
    'https://local-qr.karasu256.com',
    'https://local-auth.karasu256.com',
    'https://local-sso.karasu256.com',
  ],
};

type ClientConfigDefaults = typeof PRODUCTION_DEFAULTS;

function clientConfigSchema(defaults: ClientConfigDefaults) {
  return z.object({
    authApiUrl: z.url().default(defaults.authApiUrl),
    authUrl: z.url().default(defaults.authUrl),
    accountsUrl: z.url().default(defaults.accountsUrl),
    appUrl: z.url().default(defaults.appUrl),
    turnstileSiteKey: z.string().min(1).default(defaults.turnstileSiteKey),
    trustedOrigins: z.array(z.url()).min(1).default(defaults.trustedOrigins),
  });
}

export type ClientConfig = z.infer<ReturnType<typeof clientConfigSchema>>;

export function getClientConfig(): ClientConfig {
  const defaults = process.env.APP_ENV === 'local' ? LOCAL_DEFAULTS : process.env.APP_ENV === 'preview' ? PREVIEW_DEFAULTS : PRODUCTION_DEFAULTS;

  return clientConfigSchema(defaults).parse({
    authApiUrl: process.env.AUTH_API_URL,
    authUrl: process.env.AUTH_URL,
    accountsUrl: process.env.ACCOUNTS_URL,
    appUrl: process.env.APP_URL,
    turnstileSiteKey: process.env.TURNSTILE_SITE_KEY,
    trustedOrigins: process.env.TRUSTED_ORIGINS
      ? process.env.TRUSTED_ORIGINS.split(',')
          .map((origin) => origin.trim())
          .filter((origin) => origin.length > 0)
      : undefined,
  });
}
