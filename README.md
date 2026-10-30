# sso.karasu256.com

The SSO sign-in pages of the monorepo's authentication system, specialized for organization single sign-on while sharing the same foundation as auth.karasu256.com: it holds only a better-auth client (`authClient`) and UI, and the better-auth server itself (sessions, the `@better-auth/sso` plugin with SAML 2.0 and OIDC providers, and everything else) runs in api-auth.karasu256.com, which this app calls through `NEXT_PUBLIC_AUTH_API_URL`.

The sign-in page asks for a work email address and hands the user to the identity provider registered for its domain (`authClient.signIn.sso`). It also publishes the SAML connection information an identity provider administrator needs — the Service Provider metadata URL, the ACS URL, and the SP entity ID — all derived from the api-auth base URL, so this site is the one place that information lives.

It has no database of its own. SSO provider registrations are stored by api-auth in the shared `sso_provider` table. Users whose organization does not use SSO sign in on auth.karasu256.com instead, and account management (`/settings`) stays in accounts.karasu256.com.

Run commands from the repository root, e.g. `pnpm --filter sso.karasu256.com dev` (port 3007).

## Deployment

Deployed as a Cloudflare Worker by `.github/workflows/sso-deploy.yml`, a thin wrapper around the shared [`deploy-worker`](https://github.com/Karasu-Lab/Workers) action (`Karasu-Lab/Workers/deploy-worker@v1`): pushes to `main` deploy production, other branches deploy a per-branch Preview (only the newest five Previews are kept). No custom domain is attached yet; the worker serves on its workers.dev subdomain. The workflow reads `CLOUDFLARE_API_TOKEN` (secret) and `CLOUDFLARE_ACCOUNT_ID` (variable) from the `production` / `preview` GitHub Environments.
