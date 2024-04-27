
# reference projects
These are also potential boilerplates to start from
- [materio](https://mui.com/store/previews/materio-mui-react-nextjs-admin-template/)
- [platforms](https://github.com/vercel/platforms)
- [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo)
- [infisical](https://github.com/search?q=infisical&type=repositories)
- [saas-starter-kit](https://github.com/boxyhq/saas-starter-kit)
- [refine](https://github.com/refinedev/refine)
- [cal.com](https://github.com/calcom/cal.com)

# Security, Authentication & Authorization
- Data Access Layer (DAL) for models
- SAML 2.0
- CASL
- Policies?
- ABAC
- Webauthn
- TOTP
- sms otp
- email verification
- Fido2
- OIDC
- SIWE (eth auth)
- E2E Encryption
- csrf token required on all mutations (prevent XSRF)
- CSP
- Google Captcha?
- Cloud falre ddos protection?

# Database & Storage
- vercel postgres or neon
- setup drizzle
- migrations? or use neons push model
- seed script
- logging
- S3 Bucket
- CDN with domain
- Presigned urls and ability to upload direct to s3
- vercel KV

# Logging

> *Unsure about the decisions here.
> - Elpresidank*

- sentry?
- datadog?
- Drizzle Logger
- Grafana + Loki?

# Analytics
- Google Analytics?
- what are open source alternatives

# Dev Tooling
- eslint config
- typescript config
- prettier config
- husky config
- changesets
- turbo cache
- playwright
- jest
- manypkg
- Infisical Secrets
- turbogen

# apps
- @dank/admin
- @dank/blog
- @dank/docs
- @dank/web
- @dank/app
- @dank/mobile
- @dank/auth-proxy
- @dank/api
- @dank/storybook
- @dank/e2e

# Protocols
- https
- websockets
- Web RTC?

# Packages
- @dank/config
	- eslint
	- typescript
	- env
	- jest
	- prettier 

- @dank/ui
	- icons
	- templates
	- pages
	- forms
	- inputs
	- display
	- feedback
	- surfaces
	- navigation
	- layout
	- utils
	- tables
- @dank/helpers
- @dank/auth
- @dank/db
-  @dank/constants
- @dank/types
- @dank/email
- @dank/lib
- @dank/theme

# Documentation
- MDX
- storybook
- AI integration?
- Liveblocks?
- Documentation versions like tanstack's docs


# CI/CD, Versioning & Deploys
- Github Actions or Gitlab?
- terraform typescript sdk?
- if gitlab custom runner
- Container Registry (ECR, Docker Hub)
- Docker Images with versions
- Infisical Secrets integrations
- Infisical repo scanning
- canaries?
- blue/green deploys?
- aws cdk?
- 

# Error handling & Validation
> *Sentry trace propogation.*
> *- TheFranklyDank*
- Suspense Boundaries & Fallback UI
- zod

# Queries & Mutations
- @tanstack/react-query
- trpc
- open api trpc
- use react suspence
- streamed hydration

# DNS & Tenancy
- domains per tenant
- sub sub domains for teams in tenants
- "super tenant" like a tenant for sys admins with its own set of permissions
- nextjs re-writes
- nextjs middleware
- vercel domains api


# UI
- @tanstack/form
- mui
- tailwind
- shadcn
- aceternity
- react flow
- materio baseline
- radix ui
- @tanstack/table
- d3?
- framer-motion
- quill

# Integrations
- OAuth 2.0
- Webhooks
- Api keys
- Keybase notifications?
- slack notifications

# Localization & i18n
- i18next?
- custom server side translations
- mui localization provider

# Misc.
- zustand use broadcast
- webassembly
- indexdb
- PWA
- Offline Mode Service Workers
- Videos, HLS, Streaming

# Client 



