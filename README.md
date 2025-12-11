# AddisLink Deployment Guide

## Prerequisites
- Node.js (v18+)
- GitHub repository linked to this project (already pushed).
- Vercel account and Vercel CLI (`npm i -g vercel`).
- Render account (or any other hosting provider) for the Telegram bot.
- Environment variables set in both platforms:
  - `DATABASE_URL` – PostgreSQL connection string.
  - `NEXT_PUBLIC_BASE_URL` – URL of the deployed Vercel site (e.g., `https://addislink.vercel.app`).
  - `CLOUDINARY_URL` – Cloudinary credentials.
  - `TELEGRAM_BOT_TOKEN` – Bot token.

## Frontend (Next.js) – Deploy to Vercel
1. Install Vercel CLI if not already installed:
   ```bash
   npm i -g vercel
   ```
2. Login to Vercel:
   ```bash
   vercel login
   ```
3. From the project root, run:
   ```bash
   vercel --prod
   ```
   This will build the project, upload the output, and give you a production URL.
4. In the Vercel dashboard, add the required environment variables under **Settings → Environment Variables**.
5. After deployment, verify the site loads and the product detail page shows the image gallery.

## Backend (Telegram Bot) – Deploy to Render
1. Create a new **Web Service** (or **Background Worker**) in Render.
2. Connect the same GitHub repository.
3. Set the **Build Command** to:
   ```bash
   npm install && npx prisma generate
   ```
4. Set the **Start Command** to:
   ```bash
   npm run bot
   ```
5. Add the same environment variables (except `NEXT_PUBLIC_BASE_URL` is optional for the bot).
6. Deploy. Render will start the bot process; you should see `Bot is running...` in the logs.

## Verify End‑to‑End
- Open the Vercel URL, browse products, and ensure the gallery works.
- Send a media group (album) to the Telegram bot with a caption. The product should be created with multiple images and appear on the site.

## Troubleshooting
- If you see Prisma errors, ensure `npx prisma generate` ran successfully after any schema changes.
- For image loading issues, confirm Cloudinary URLs are whitelisted in `next.config.ts` (already includes `res.cloudinary.com`).
- Check logs on Render for bot errors.

---
*This guide was generated automatically after completing the code changes and setup.*
