# Khorcha Khata

[![CI](https://github.com/Subham0822/Expensify-Zen/actions/workflows/ci.yml/badge.svg)](https://github.com/Subham0822/Expensify-Zen/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Khorcha Khata** is a minimal, calming expense tracker. It lets you quickly log expenses, see them in a clean two‑column layout (name and amount), and view your total spent. Authentication is handled via Firebase (Google and GitHub), and data is stored in Firebase.

## Features

- **Expense list**: Clean two‑column display of name and amount
- **Total spent**: Automatic aggregation of all logged expenses
- **Social auth**: Sign in with Google or GitHub via Firebase Authentication
- **Modern UI**: Tailwind CSS + shadcn/ui with a soft violet theme

## Tech stack

- **Framework**: Next.js (App Router) + TypeScript
- **UI**: Tailwind CSS, shadcn/ui
- **Auth & data**: Firebase (Authentication, Firestore)

---

## Getting started

### Prerequisites

- Node.js 18+ (LTS recommended; CI uses Node 20 — see `.nvmrc`)
- A Firebase project (with a Web App created)

### Environment variables

Copy the example file and fill in your Firebase Web SDK values:

```bash
cp .env.example .env.local
```

Variables (see `.env.example` for the full list):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Optional if you enable these Firebase services
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
```

Where to find these values:

- In Firebase Console → Project settings → Your apps → Web app → SDK setup and configuration.
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` should typically look like `<project-id>.firebaseapp.com` (or your custom Firebase Hosting domain).

### Install and run

```bash
npm ci
npm run dev
```

The app runs at [http://localhost:9002](http://localhost:9002) (see `package.json` `dev` script).

### Checks (same as CI)

```bash
npm run lint
npm run typecheck
npm run build
```

For `build`, set the same `NEXT_PUBLIC_*` variables as in production (CI uses placeholder values).

---

## Firebase setup

1. In Firebase Console → Authentication → Sign-in method:
   - Enable **Google** and **GitHub** providers.
2. In Authentication → Settings → Authorized domains:
   - Add your local and deployed domains, e.g. `localhost`, `khorcha-khata.vercel.app`.
3. Copy the Web App config values (API key, auth domain, project ID, app ID) into `.env.local` (and your Vercel env for production).
4. If using GitHub auth, set the callback URL in your GitHub OAuth App to the value shown by Firebase (usually `https://<your-auth-domain>/__/auth/handler`).

---

## Deployment (Vercel)

1. Add the same environment variables in your Vercel Project Settings → Environment Variables.
2. Redeploy the app after any env or provider changes.
3. Ensure your Vercel domain(s) are added to Firebase Authorized domains.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

See [SECURITY.md](SECURITY.md).

---

## Troubleshooting

- **auth/unauthorized-domain**: Add the exact deployed domain (e.g., `khorcha-khata.vercel.app`) to Firebase → Authentication → Settings → Authorized domains. Make sure there are no typos.
- **404 on `__/auth/iframe`**: Verify `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` is your Firebase auth domain (e.g., `<project-id>.firebaseapp.com`).
