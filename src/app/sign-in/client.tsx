'use client';

import { useSearchParams } from 'next/navigation';
import { SamlConnectionInfoDialog } from '@/components/sso/saml-connection-info';
import { SignInFlow } from '@/components/sso/sign-in-flow';
import { useSdk } from '@/lib/auth/client';
import { getContinueTo } from '@/lib/redirect';

export function SignInClient() {
  const searchParams = useSearchParams();
  const { config } = useSdk();

  return (
    <>
      <SamlConnectionInfoDialog placement="page" />
      <SignInFlow
        continueTo={getContinueTo(searchParams, config)}
        forceLogin={searchParams.get('prompt') === 'login'}
        errorCode={searchParams.get('error') ?? undefined}
      />
    </>
  );
}
