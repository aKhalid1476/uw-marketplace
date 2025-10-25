# Supabase Setup Instructions for UW Marketplace

This guide will walk you through setting up Supabase for the UW Marketplace application.

## Prerequisites

- A [Supabase](https://supabase.com) account (free tier works fine for development)
- Node.js and npm installed locally

## Step-by-Step Setup

### 1. Create a New Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"New Project"**
3. Sign in or create an account
4. Click **"New Project"** in your dashboard
5. Fill in the project details:
   - **Name**: `uw-marketplace` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the region closest to your users
   - **Pricing Plan**: Free tier is sufficient for development
6. Click **"Create new project"**
7. Wait 2-3 minutes for your project to be provisioned

### 2. Get Your API Keys

1. Once your project is ready, go to **Settings** > **API** in the left sidebar
2. You'll see your API credentials:
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret**: This is your `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

3. Copy these values to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 3. Run the Database Schema

#### Option A: Using the Supabase SQL Editor (Recommended)

1. In your Supabase dashboard, click on **SQL Editor** in the left sidebar
2. Click **"New query"**
3. Open the `lib/supabase/schema.sql` file from this project
4. Copy the entire contents of the file
5. Paste it into the SQL Editor
6. Click **"Run"** at the bottom right
7. You should see a success message: "Success. No rows returned"

#### Option B: Using the Supabase CLI

1. Install the Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref your-project-id
```

4. Run the migration:
```bash
supabase db push
```

### 4. Verify the Schema

1. In your Supabase dashboard, go to **Database** > **Tables**
2. You should see the following tables:
   - `users`
   - `verification_codes`
   - `listings`
   - `messages`
   - `price_history`

3. Click on each table to verify the columns and indexes are created correctly

### 5. Configure Authentication (Optional)

If you want to enable email authentication:

1. Go to **Authentication** > **Providers** in the left sidebar
2. Enable **Email** provider
3. Configure email templates as needed
4. For development, you can enable **"Confirm email"** to be disabled

### 6. Set Up Row Level Security (RLS)

The schema already includes RLS policies. To verify they're active:

1. Go to **Authentication** > **Policies**
2. You should see policies for each table
3. If you need to modify policies, you can do so in the **Table Editor** > Select a table > **Policies** tab

### 7. Enable Realtime (Optional)

If you want real-time updates for messages:

1. Go to **Database** > **Replication**
2. Enable replication for the `messages` table
3. This allows real-time subscriptions to message updates

### 8. Test the Connection

Create a simple test file to verify your connection:

```typescript
// test-supabase.ts
import { createClient } from '@/lib/supabase/client'

async function testConnection() {
  const supabase = createClient()
  const { data, error } = await supabase.from('users').select('count')

  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Connection successful!', data)
  }
}

testConnection()
```

Run it with:
```bash
npx tsx test-supabase.ts
```

## Database Schema Overview

### Tables

1. **users** - User profiles and account information
   - Primary key: `id` (UUID)
   - Unique: `email`
   - Includes: `full_name`, `profile_picture_url`, timestamps

2. **verification_codes** - Email verification codes for passwordless auth
   - Primary key: `id` (UUID)
   - Stores 6-digit codes with expiration
   - Auto-cleanup of expired codes via function

3. **listings** - Marketplace items/listings
   - Primary key: `id` (UUID)
   - Foreign key: `seller_id` → `users(id)`
   - Includes: `title`, `description`, `price`, `category`, `image_urls`, `status`
   - Status: `active`, `sold`, `deleted`

4. **messages** - Messages between buyers and sellers
   - Primary key: `id` (UUID)
   - Foreign keys: `listing_id`, `sender_id`, `receiver_id`
   - Includes read status tracking

5. **price_history** - Historical pricing data for AI analysis
   - Primary key: `id` (UUID)
   - Foreign key: `listing_id`
   - Automatically populated via trigger when listings are created

### Indexes

The schema includes optimized indexes for:
- Fast lookups by email, category, status
- Efficient sorting by date and price
- Quick filtering of unread messages
- Category-based price analysis

### Triggers

- **update_updated_at**: Automatically updates `updated_at` timestamp
- **add_listing_to_price_history**: Auto-populates price history for new listings

### Views

- **active_listings_with_seller**: Active listings joined with seller info
- **message_threads**: Latest messages grouped by conversation

## Useful SQL Queries

### Get all active listings in a category
```sql
SELECT * FROM active_listings_with_seller
WHERE category = 'Textbooks'
ORDER BY created_at DESC;
```

### Get average price by category
```sql
SELECT category, AVG(price) as avg_price, COUNT(*) as count
FROM price_history
GROUP BY category
ORDER BY avg_price DESC;
```

### Get unread message count for a user
```sql
SELECT COUNT(*) as unread_count
FROM messages
WHERE receiver_id = 'user-uuid-here' AND read = FALSE;
```

## Troubleshooting

### Issue: "relation does not exist" error
- **Solution**: Make sure you ran the schema.sql file completely
- Check the SQL Editor for any errors during execution

### Issue: RLS policies blocking queries
- **Solution**: Temporarily disable RLS for testing:
  ```sql
  ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
  ```
- Don't forget to re-enable it after testing!

### Issue: Connection refused or invalid credentials
- **Solution**: Double-check your `.env.local` file
- Make sure you're using the correct Project URL and API keys
- Verify there are no extra spaces in the environment variables

### Issue: Service role key not working
- **Solution**: The service role key should only be used server-side
- Never expose it in client-side code
- Check that you're using `createServerClient()` in API routes

## Next Steps

1. ✅ Set up Supabase project
2. ✅ Add API keys to `.env.local`
3. ✅ Run the database schema
4. ✅ Verify tables are created
5. 📝 Generate TypeScript types (see below)
6. 🚀 Start building your application!

## Generating TypeScript Types

You can generate TypeScript types from your database schema:

```bash
# Install the Supabase CLI
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref your-project-id

# Generate types
supabase gen types typescript --linked > types/database.ts
```

This will create type-safe database types for use in your application.

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Realtime Subscriptions](https://supabase.com/docs/guides/realtime)

## Support

If you encounter any issues:
1. Check the [Supabase Discord](https://discord.supabase.com)
2. Review the [Supabase GitHub Discussions](https://github.com/supabase/supabase/discussions)
3. Check your browser console and server logs for detailed error messages
