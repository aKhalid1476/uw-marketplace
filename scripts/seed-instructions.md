# Database Seed Instructions

This guide explains how to populate your UW Marketplace database with sample demo data.

## Prerequisites

Before running the seed script, ensure you have:

1. **Environment Variables Set**
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (found in project settings)

2. **Database Schema Created**
   - Run the SQL schema in Supabase SQL Editor: `lib/supabase/schema.sql`
   - All tables should be created before seeding

3. **Dependencies Installed**
   - Run `npm install` to ensure all packages are installed

## How to Run the Seed Script

### Option 1: Using npm script (Recommended)

```bash
npm run seed
```

### Option 2: Using tsx directly

```bash
npx tsx scripts/seed.ts
```

## What Gets Created

The seed script will populate your database with:

### Users (5 total)
- alice.chen@uwaterloo.ca
- bob.smith@uwaterloo.ca
- carol.martinez@uwaterloo.ca
- david.kim@uwaterloo.ca
- emma.johnson@uwaterloo.ca

**All users have the password:** `password123`

### Listings (30 total)

Distributed across all categories:

- **Electronics** (8 listings)
  - MacBook Pro, iPhone, monitors, peripherals, etc.
  - Price range: $75 - $899

- **Furniture** (6 listings)
  - Desks, chairs, lamps, bookshelves, etc.
  - Price range: $15 - $399

- **Books** (6 listings)
  - Course textbooks for CS, MATH, ECE, ECON, STAT
  - Price range: $25 - $80

- **Clothing** (4 listings)
  - Winter jackets, hoodies, boots
  - Price range: $30 - $499

- **Tickets** (3 listings)
  - Concert and sports tickets
  - Price range: $150 - $280

- **Other** (2 listings)
  - Mini fridge, coffee maker
  - Price range: $35 - $60

### Price History
- 15 listings with historical price data
- 3-5 price points per listing
- Used for AI price recommendations

### Sample Conversations
- 5 complete conversations between users
- Realistic message exchanges about listings
- Mix of read and unread messages

## Important Notes

⚠️ **Warning: This script will clear ALL existing data before seeding!**

The script performs the following operations in order:

1. Deletes all messages
2. Deletes all price history entries
3. Deletes all listings
4. Deletes all verification codes
5. Deletes all users
6. Creates new sample data

### Service Role Key Required

The seed script uses the **service role key** to bypass Row Level Security (RLS) policies. This key has full access to your database.

- **Never commit** the service role key to version control
- Keep it in `.env.local` (which is gitignored)
- Only use it for development/seeding purposes

## After Seeding

Once the seed script completes successfully:

1. **Browse the marketplace** at `http://localhost:3000/browse`
   - You should see 30 listings across different categories

2. **Login with sample credentials:**
   ```
   Email: alice.chen@uwaterloo.ca
   Password: password123
   ```

3. **Test features:**
   - View listings
   - Contact sellers (chat feature)
   - Create new listings
   - Browse by category
   - Search listings

4. **Switch users** to test conversations:
   - Login as Bob to see Alice's messages
   - Reply to messages
   - Test real-time chat

## Troubleshooting

### "Missing required environment variables"
- Check that `.env.local` contains both `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Restart your dev server after adding environment variables

### "Failed to create user" or other database errors
- Ensure the database schema is properly set up
- Check Supabase dashboard for any RLS policy conflicts
- Verify your service role key is correct

### "Module not found" errors
- Run `npm install` to install all dependencies
- Ensure `bcryptjs` and `@supabase/supabase-js` are installed

### Images not loading
- The seed uses Unsplash CDN images
- If images don't load, check your internet connection
- You can replace URLs in `seed.ts` with your own image sources

## Re-running the Seed

You can run the seed script multiple times. Each run will:
1. Clear all existing data
2. Create fresh sample data

This is useful for:
- Resetting to a clean state
- Testing with fresh data
- Demos and presentations

## Customizing the Seed Data

To modify the sample data, edit `scripts/seed.ts`:

- **Add more users:** Add to `sampleUsers` array
- **Add more listings:** Add to `sampleListings` array
- **Change prices:** Modify the `price` field
- **Different images:** Replace Unsplash URLs
- **More messages:** Add to `sampleMessages` array

After making changes, re-run the seed script.
