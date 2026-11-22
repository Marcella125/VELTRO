This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
"# Platinum" 
"# Platinum" 

## Veltro Admin CMS

The protected CMS is available at `/admin`. It uses a signed HTTP-only session,
server-side authorization on every write endpoint, and a relational SQLite
database stored at `.data/veltro.db` by default.

Copy `.env.example` to `.env.local` and set strong production values for:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `VELTRO_DB_PATH` (use a persistent writable volume in production)

Development-only fallback credentials are `veltroadmin@gmail.com` / `Veltro123`.
They are disabled automatically when `NODE_ENV=production`.

Because the CMS needs server routes and persistent storage, the project is no
longer configured as a static export. Deploy it to a Node.js host with a
persistent volume, or replace the database adapter with the production database
used by your hosting platform.
