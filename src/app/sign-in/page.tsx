import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { SignInClient } from './client';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');
  return { title: t('signIn.title') };
}

/** SSO sign-in page: the SSO counterpart of auth.karasu256.com's sign-in page; the SAML connection information lives behind the info button in the top-right corner. */
export default function SignInPage() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-6 p-4">
      <Suspense>
        <SignInClient />
      </Suspense>
    </main>
  );
}
