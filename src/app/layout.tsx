import type { Metadata } from 'next';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './globals.css';
import { Toaster } from '@karasu-lab/ui';
import { geistSans, geistMono, notoSansJP } from '@karasu-lab/ui/fonts';
import { LocaleProvider } from '@/components/locale-provider';
import { defaultLocale } from '@/i18n/locales';
import { SdkProvider } from '@/lib/auth/client';
import jaMessages from '../../messages/ja.json';

config.autoAddCss = false;

export const metadata: Metadata = {
  metadataBase: new URL('https://sso.karasu256.com'),
  title: { default: jaMessages.Metadata.siteTitle, template: '%s' },
  description: jaMessages.Metadata.siteDescription,
  icons: {
    icon: '/icons/kara_su.png',
    shortcut: '/icons/kara_su.png',
    apple: '/icons/kara_su.png',
  },
  openGraph: {
    title: jaMessages.Metadata.siteTitle,
    description: jaMessages.Metadata.siteDescription,
    siteName: 'Karasu Lab',
    locale: defaultLocale,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: jaMessages.Metadata.siteTitle,
    description: jaMessages.Metadata.siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLocale} className={`${geistSans.variable} ${geistMono.variable} ${notoSansJP.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <LocaleProvider>
          <SdkProvider>{children}</SdkProvider>
        </LocaleProvider>
        <Toaster />
      </body>
    </html>
  );
}
