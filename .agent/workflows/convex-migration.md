---
description: Migrate to a new Convex project
---

# Convex Project Migration Guide

This workflow will help you set up a new Convex project and migrate your existing data.

## Prerequisites
- Ensure you have the Convex CLI installed globally
- Have your Convex account credentials ready

## Step 1: Install/Update Convex CLI
```bash
npm install -g convex
```

## Step 2: Login to Convex
```bash
npx convex login
```

## Step 3: Initialize New Convex Project
This will create a new deployment and update your `.env.local` file with new credentials.

```bash
npx convex dev --once
```

**Important:** This command will:
- Create a new Convex project/deployment
- Generate new `VITE_CONVEX_URL` in `.env.local`
- Push your schema and functions to the new deployment

## Step 4: Verify Schema Deployment
Check that your schema was deployed successfully:

```bash
npx convex dashboard
```

This will open the Convex dashboard in your browser where you can verify:
- All tables are created (events, news, comments, userReactions, families, familyNodes, socialLinks)
- Schema matches your local `convex/schema.ts`

## Step 5: Restart Development Server
After the new Convex project is set up, restart your Vite dev server:

```bash
npm run dev
```

## Step 6: Test Basic Functionality
1. Open your application in the browser
2. Try creating a new event or news item
3. Verify that data is being saved to the new Convex deployment

## Step 7: Data Migration (Optional)

If you need to migrate existing data from your old deployment:

### Option A: Manual Migration via Dashboard
1. Export data from old deployment (if still accessible)
2. Import data through the new Convex dashboard

### Option B: Programmatic Migration
If you have access to the old deployment, you can create a migration script:

1. Keep the old `VITE_CONVEX_URL` temporarily in a separate variable
2. Create a migration script that reads from old deployment and writes to new
3. Run the migration script

## Troubleshooting

### If `npx convex dev --once` fails:
- Make sure you're logged in: `npx convex login`
- Check your internet connection
- Verify your Convex account is active

### If schema doesn't match:
- Run `npx convex dev` (without --once) to watch for changes
- Make a small change to `convex/schema.ts` and save
- The schema should auto-deploy

### If you see old deployment errors:
- Clear your browser cache and local storage
- Restart the dev server
- Verify `.env.local` has the new `VITE_CONVEX_URL`

## Notes
- Your old deployment data will NOT be automatically migrated
- You'll start with empty tables in the new deployment
- Keep your old deployment URL if you need to reference old data
- The free tier gives you a fresh start with new limits
