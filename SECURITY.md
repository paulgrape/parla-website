# Security Policy

## Supported versions

Security fixes are applied to the latest release on the default branch (`master`).

| Version | Supported |
| ------- | --------- |
| latest  | yes       |

## Reporting a vulnerability

If you believe you have found a security issue in Parla, please **do not** open a public GitHub issue with exploit details, credentials, or personal data.

Instead:

1. Open a [GitHub Security Advisory](https://github.com/paulgrape/parla-website/security/advisories/new) (preferred), **or**
2. Open a private [GitHub issue](https://github.com/paulgrape/parla-website/issues/new) and mark it sensitive if the option is available.

Include:

- A clear description of the issue and its impact
- Steps to reproduce
- Affected routes or components, if known

Please do **not** include live API keys, Clerk secrets, webhook signing secrets, database URLs, or user data in your report.

## What to expect

This is a personal, non-commercial project. I aim to acknowledge reports within a reasonable time and will work on fixes for confirmed issues affecting user data or authentication. I cannot guarantee SLA timelines.

## Out of scope

- Issues in third-party services (Clerk, Vercel, Cloudflare Workers, Neon)
- Social engineering or phishing against users
- Denial-of-service attacks against the live demo

Thank you for helping keep Parla safe.
