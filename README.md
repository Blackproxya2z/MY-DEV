# JAHIN AZMAIN — THE CREATIVE ODYSSEY (v2.0)

> **Interactive Brand Worlds, Digital Products & Growth Systems**  
> Built for **Jahin Azmain** — Creative Technologist, Brand Builder, Digital Marketer & Multi-Disciplinary Designer based in Dhaka, Bangladesh.

---

## 1. Architecture & Production Stack

- **Framework**: Next.js 14.2 (App Router, Server Components, Edge Middleware) + TypeScript 5.6
- **Styling & Theme System**: Tailwind CSS 3.4 + CSS Custom Properties (`src/styles/tokens.css`)
  - **Dark Cosmic Editorial** (`#0B0D14` obsidian canvas, `#9B8CFF` cosmic-violet accent, `#E8C998` warm-gold highlight)
  - **Minimalist Light** (`#F5F5F7` gallery alabaster)
  - **Classic Blue** (`#0071E3` precision blue)
- **Database & Persistence Engine (`src/lib/db/index.ts` & `src/lib/firebase/index.ts`)**:
  - **Primary Cloud Database**: **Google Firebase** (supports both **Cloud Firestore** via Service Account JWT and **Firebase Realtime Database** via `FIREBASE_DATABASE_URL`). Auto-seeds the 24 CMS collections on first boot if the database is empty.
  - **Alternative Cloud Database**: **Supabase PostgreSQL** (`supabase/migrations/0001_initial_schema.sql` & `0002_rls_and_storage.sql`).
  - **Local & Serverless Fallback**: Local JSON store (`.data/odyssey-db.json` locally, `/tmp/odyssey-db.json` on Vercel Serverless when cloud env vars are not yet added).
- **Edge & Application Security (`src/middleware.ts` & `src/lib/security/index.ts`)**:
  - **Cloudflare Integration**: Real visitor IP extraction (`cf-connecting-ip`), privacy-safe SHA-256 IP hashing for rate limiting, and server-side **Cloudflare Turnstile** verification on `/api/contact` and `/api/admin/auth`.
  - **Edge Security Headers**: Content-Security-Policy (CSP), HSTS (`max-age=63072000; includeSubDomains; preload`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Permissions-Policy`, and `X-Robots-Tag: noindex, nofollow` on `/admin/*` and `/api/*`.
  - **CSRF & Auth Hardening**: Strict Origin/Host verification on all mutating `/api/*` requests, `HttpOnly; Secure; SameSite=Lax` HMAC-SHA256 admin session cookies, and constant-time (`crypto.timingSafeEqual`) credential comparison.

---

## 2. Step-by-Step Production Deployment Guide (Firebase + Vercel + Cloudflare)

### Step A — Push to Your GitHub Repository
If you haven't linked your remote GitHub repository yet, create a new repository on GitHub (e.g., `jahin-azmain-creative-odyssey`) and run:

```bash
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
git branch -M main
git push -u origin main
```

---

### Step B — Set Up Firebase Database (Cloud Firestore or Realtime Database)
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a project (e.g., `jahin-creative-odyssey`).
2. **Enable Firestore Database** (Recommended):
   - Go to **Build → Firestore Database → Create database**.
   - Select your nearest region (e.g., `asia-southeast1` Singapore) and start in **Production mode**.
   - Copy the rules from [`firestore.rules`](./firestore.rules) into the Firestore **Rules** tab and click **Publish** (this locks out all direct browser/client SDK reads and writes while allowing your Next.js server's Service Account full access).
3. **Generate Service Account Credentials**:
   - Go to **Project Settings (Gear Icon) → Service accounts → Generate new private key**.
   - Open the downloaded JSON file and copy these 3 values for Vercel:
     - `project_id` → `FIREBASE_PROJECT_ID`
     - `client_email` → `FIREBASE_CLIENT_EMAIL`
     - `private_key` → `FIREBASE_PRIVATE_KEY`
4. *(Alternative)* **Firebase Realtime Database**:
   - If you prefer Realtime Database instead of Firestore, create a Realtime Database, copy its URL into `FIREBASE_DATABASE_URL`, and paste [`database.rules.json`](./database.rules.json) into its Rules tab.

> **Auto-Seeding**: The very first time your Vercel site boots with Firebase credentials configured, `src/lib/db/index.ts` will automatically seed all 8 homepage chapters, 6 services, 6 portfolio projects, and verified contact details into Firebase!

---

### Step C — Deploy on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/new) and import your GitHub repository.
2. In **Environment Variables**, add the following variables (see [`.env.example`](./.env.example)):

| Variable Name | Value / Description |
| :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Your production domain (e.g., `https://jahinazmain.com`) |
| `FIREBASE_PROJECT_ID` | From your Firebase Service Account JSON |
| `FIREBASE_CLIENT_EMAIL` | From your Firebase Service Account JSON |
| `FIREBASE_PRIVATE_KEY` | Full `-----BEGIN PRIVATE KEY-----...` string from Firebase JSON |
| `ADMIN_ALLOWED_EMAIL` | `azmain56@gmail.com` |
| `ADMIN_BOOTSTRAP_PASSCODE` | Choose a strong password for `/admin/login` |
| `ADMIN_SESSION_SECRET` | Random 64-char hex secret (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | *(Optional)* Cloudflare Turnstile Site Key |
| `TURNSTILE_SECRET_KEY` | *(Optional)* Cloudflare Turnstile Secret Key |

3. Click **Deploy**. Vercel will build and deploy to the Singapore (`sin1`) edge region configured in [`vercel.json`](./vercel.json).

---

### Step D — Configure Cloudflare (DNS, SSL, WAF & Turnstile)
1. **DNS Setup**:
   - In your Cloudflare Dashboard, point your root domain (`@`) `A` record to `76.76.21.21` (Vercel) and `www` `CNAME` to `cname.vercel-dns.com`.
   - Keep the **Orange Cloud (Proxied)** enabled so Cloudflare WAF and DDoS protection sit in front of Vercel.
2. **SSL/TLS Mode**:
   - Go to **SSL/TLS → Overview** and set encryption mode to **Full (strict)** (never use Flexible, or it will cause redirect loops with Vercel).
3. **Cloudflare Turnstile (Anti-Bot Protection)**:
   - Go to **Cloudflare Dashboard → Turnstile → Add widget**.
   - Add your domain, choose **Managed**, and copy the **Site Key** (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`) and **Secret Key** (`TURNSTILE_SECRET_KEY`) into your Vercel Environment Variables.
4. **Cloudflare WAF Rule for `/admin/*` (Extra Layer)**:
   - In Cloudflare **Security → WAF → Custom rules**, you can add a Managed Challenge rule for `(http.request.uri.path contains "/admin")` to require Cloudflare bot verification before anyone even reaches the admin login page.

---

## 3. Local Development & Verification Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Run TypeScript check & ESLint
npm run typecheck
npm run lint

# Run Vitest unit & integration tests
npm run test

# Run Playwright E2E verification suite
npm run test:e2e

# Create production build
npm run build
```
