/**
 * Database Seed Script
 *
 * Populates the database with sample data for development and demo purposes
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'
import * as bcrypt from 'bcryptjs'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Sample data
const sampleUsers = [
  {
    email: 'alice.chen@uwaterloo.ca',
    full_name: 'Alice Chen',
    password: 'password123',
  },
  {
    email: 'bob.smith@uwaterloo.ca',
    full_name: 'Bob Smith',
    password: 'password123',
  },
  {
    email: 'carol.martinez@uwaterloo.ca',
    full_name: 'Carol Martinez',
    password: 'password123',
  },
  {
    email: 'david.kim@uwaterloo.ca',
    full_name: 'David Kim',
    password: 'password123',
  },
  {
    email: 'emma.johnson@uwaterloo.ca',
    full_name: 'Emma Johnson',
    password: 'password123',
  },
]

const sampleListings = [
  // Electronics
  {
    title: 'MacBook Pro 2020 - Perfect for CS Students',
    description: 'Selling my trusty MacBook Pro (2020, M1 chip, 8GB RAM, 256GB SSD). Used for ECE 150 and CS 136. Still runs like new! Includes charger and case. Great for coding and running IDEs.',
    price: 899,
    category: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
  },
  {
    title: 'iPhone 13 - Excellent Condition',
    description: '128GB, Blue, unlocked. Battery health 95%. Small scratch on back (barely visible). Comes with original box and charging cable. Perfect backup phone or upgrade!',
    price: 549,
    category: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1592286927505-4145c1d0e0a5?w=800',
  },
  {
    title: 'Dell 27" Monitor - Dual Monitor Setup',
    description: 'Dell UltraSharp 27" 1440p monitor. Perfect for coding or gaming. Used for co-op work term. No dead pixels, adjustable stand. Great condition!',
    price: 299,
    category: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
  },
  {
    title: 'Logitech MX Master 3 Mouse',
    description: 'Barely used wireless mouse. Perfect for productivity and coding. Multi-device connection, rechargeable battery. Switching to trackpad.',
    price: 75,
    category: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800',
  },
  {
    title: 'iPad Air 2022 + Apple Pencil',
    description: '64GB, Space Gray. Includes 2nd Gen Apple Pencil. Used for note-taking in lectures. Screen protector applied. Perfect for students!',
    price: 599,
    category: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
  },
  {
    title: 'Sony WH-1000XM4 Noise Cancelling Headphones',
    description: 'Amazing noise cancellation - perfect for studying in loud environments. Comes with case and all accessories. Battery life still excellent.',
    price: 249,
    category: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
  },
  {
    title: 'Samsung Galaxy S22 Ultra',
    description: '256GB, Phantom Black. Includes S Pen. Great for taking lecture notes and photos. Minor scratches on frame, screen is perfect.',
    price: 699,
    category: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
  },
  {
    title: 'Mechanical Keyboard - Cherry MX Blue',
    description: 'Custom built RGB mechanical keyboard with Cherry MX Blue switches. Perfect clicky sound for coding. Includes keycap puller.',
    price: 120,
    category: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800',
  },

  // Furniture
  {
    title: 'IKEA Desk - Perfect for Student Room',
    description: 'IKEA MICKE desk in white. 142cm wide. Perfect for dorm or apartment. Easy to assemble. Selling because moving back home after graduation.',
    price: 45,
    category: 'Furniture',
    image_url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800',
  },
  {
    title: 'Ergonomic Office Chair - Herman Miller Aeron',
    description: 'Herman Miller Aeron chair, size B. Perfect for long coding sessions. Fully adjustable. Used during co-op. Moving out sale!',
    price: 399,
    category: 'Furniture',
    image_url: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800',
  },
  {
    title: 'IKEA Floor Lamp - Reading Light',
    description: 'IKEA NOT floor lamp. Adjustable arm, soft lighting. Great for late night study sessions. Includes light bulb.',
    price: 15,
    category: 'Furniture',
    image_url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800',
  },
  {
    title: 'Bookshelf - 5 Shelf Unit',
    description: 'Sturdy 5-shelf bookshelf. Can hold textbooks, decorations, etc. Dark wood finish. Easy to disassemble for moving.',
    price: 40,
    category: 'Furniture',
    image_url: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800',
  },
  {
    title: 'Twin Size Bed Frame',
    description: 'Metal twin bed frame with headboard. Very sturdy, no squeaking. Perfect for student housing. Mattress not included.',
    price: 80,
    category: 'Furniture',
    image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
  },
  {
    title: 'Standing Desk Converter',
    description: 'Varidesk-style standing desk converter. Fits on top of regular desk. Great for posture during long coding sessions. Like new!',
    price: 85,
    category: 'Furniture',
    image_url: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800',
  },

  // Books
  {
    title: 'CS 246 Textbook - Object-Oriented Software Development',
    description: 'Official course notes for CS 246. Barely used, no highlighting. Saved me tons of time during the term. Selling after completing the course.',
    price: 35,
    category: 'Books',
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800',
  },
  {
    title: 'MATH 237 - Calculus 3 Textbook',
    description: 'Stewart Calculus 8th Edition. Minimal highlighting. Includes solution manual (digital PDF). Great condition!',
    price: 45,
    category: 'Books',
    image_url: 'https://images.unsplash.com/photo-1509266272358-7701da638078?w=800',
  },
  {
    title: 'ECE 106 Textbook - Physics for Engineers',
    description: 'University Physics with Modern Physics by Young & Freedman. 14th edition. Some highlighting in first few chapters. Good condition.',
    price: 50,
    category: 'Books',
    image_url: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800',
  },
  {
    title: 'ECON 101 + 102 Textbook Bundle',
    description: 'Microeconomics and Macroeconomics by Mankiw. Both books in excellent condition. Selling as bundle (can separate if needed).',
    price: 80,
    category: 'Books',
    image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800',
  },
  {
    title: 'CS 341 - Algorithms Textbook',
    description: 'Introduction to Algorithms (CLRS). The bible for algorithms course. Some notes in margins. Well-loved but functional.',
    price: 60,
    category: 'Books',
    image_url: 'https://images.unsplash.com/photo-1589998287351-f11e0f5e9d3c?w=800',
  },
  {
    title: 'STAT 230/231 Course Notes Bundle',
    description: 'Official course notes for both STAT 230 and 231. Never opened, perfect condition. Bought but ended up using online resources.',
    price: 25,
    category: 'Books',
    image_url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
  },

  // Clothing
  {
    title: 'Canada Goose Jacket - Size M',
    description: 'Canada Goose Expedition parka. Perfect for brutal Canadian winters. Barely worn, too warm for me. Black, size Medium.',
    price: 499,
    category: 'Clothing',
    image_url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800',
  },
  {
    title: 'UWaterloo Engineering Hoodie - Size L',
    description: 'Official black and gold Engineering hoodie. Size Large. Worn a few times. Super comfy for campus walks!',
    price: 30,
    category: 'Clothing',
    image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
  },
  {
    title: 'North Face Winter Boots - Size 10',
    description: 'Waterproof, insulated winter boots. Perfect for walking to campus in snow. Mens size 10. Excellent traction.',
    price: 65,
    category: 'Clothing',
    image_url: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800',
  },
  {
    title: 'Patagonia Fleece Jacket - Size S',
    description: 'Classic Patagonia fleece in navy blue. Size Small. Perfect layering piece for fall/spring. Like new condition.',
    price: 55,
    category: 'Clothing',
    image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
  },

  // Tickets
  {
    title: 'Drake Concert Tickets - 2 Tickets',
    description: 'Section 107, Row 15. Selling 2 tickets together for Drake concert at Scotiabank Arena. Can\'t make it anymore. Face value!',
    price: 280,
    category: 'Tickets',
    image_url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
  },
  {
    title: 'Toronto Raptors vs Lakers - Lower Bowl',
    description: 'Single ticket, Section 112, Row 10. Great seats! Selling because of exam conflict. Digital transfer available.',
    price: 150,
    category: 'Tickets',
    image_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
  },
  {
    title: 'Toronto Blue Jays vs Yankees - 4 Tickets',
    description: 'Group of 4 tickets together. 100 Level. Great for a fun day with friends. Selling below face value!',
    price: 160,
    category: 'Tickets',
    image_url: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800',
  },

  // Other
  {
    title: 'Mini Fridge - Perfect for Dorm',
    description: 'Compact mini fridge, 1.7 cubic feet. Perfect for dorm rooms. Keeps drinks cold, has small freezer section. Moving out sale.',
    price: 60,
    category: 'Other',
    image_url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800',
  },
  {
    title: 'Coffee Maker - Keurig K-Mini',
    description: 'Single-serve Keurig. Perfect for quick coffee between classes. Includes 10 K-cups. Barely used, still works great!',
    price: 35,
    category: 'Other',
    image_url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800',
  },
]

// Sample messages for conversations
const sampleMessages = [
  { content: 'Hi! Is this still available?', delay: 0 },
  { content: 'Yes it is! Are you interested?', delay: 300 },
  { content: 'Great! Can we meet on campus to see it?', delay: 600 },
  { content: 'Sure! How about DC tomorrow at 2pm?', delay: 900 },
  { content: 'Perfect, see you then!', delay: 1200 },
]

async function clearDatabase() {
  console.log('🗑️  Clearing existing data...')

  // Delete in reverse order of foreign key dependencies
  await supabase.from('messages').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('price_history').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('listings').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('verification_codes').delete().neq('email', 'none')
  await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  console.log('✅ Database cleared')
}

async function seedUsers() {
  console.log('👥 Seeding users...')

  const userIds: string[] = []

  for (const user of sampleUsers) {
    const passwordHash = await bcrypt.hash(user.password, 10)

    const { data, error } = await supabase
      .from('users')
      .insert({
        email: user.email,
        password_hash: passwordHash,
        full_name: user.full_name,
        email_verified: true,
      })
      .select()
      .single()

    if (error) {
      console.error(`❌ Failed to create user ${user.email}:`, error.message)
    } else {
      userIds.push(data.id)
      console.log(`  ✓ Created ${user.full_name} (${user.email})`)
    }
  }

  return userIds
}

async function seedListings(userIds: string[]) {
  console.log('📦 Seeding listings...')

  const listingIds: string[] = []

  for (let i = 0; i < sampleListings.length; i++) {
    const listing = sampleListings[i]
    const sellerId = userIds[i % userIds.length] // Distribute listings among users

    const { data, error } = await supabase
      .from('listings')
      .insert({
        seller_id: sellerId,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        category: listing.category,
        image_urls: [listing.image_url],
        status: 'active',
      })
      .select()
      .single()

    if (error) {
      console.error(`❌ Failed to create listing "${listing.title}":`, error.message)
    } else {
      listingIds.push(data.id)
      console.log(`  ✓ Created "${listing.title}" ($${listing.price})`)
    }
  }

  return listingIds
}

async function seedPriceHistory(listingIds: string[]) {
  console.log('💰 Seeding price history...')

  let count = 0

  // Add some price history for random listings
  for (let i = 0; i < Math.min(15, listingIds.length); i++) {
    const listingId = listingIds[Math.floor(Math.random() * listingIds.length)]
    const listing = sampleListings[i]

    // Create 3-5 historical price points for each listing
    const numEntries = 3 + Math.floor(Math.random() * 3)

    for (let j = 0; j < numEntries; j++) {
      // Generate prices slightly different from the current price
      const variance = 0.8 + Math.random() * 0.4 // 80% to 120% of current price
      const historicalPrice = Math.round(listing.price * variance)

      const { error } = await supabase
        .from('price_history')
        .insert({
          listing_id: listingId,
          category: listing.category,
          price: historicalPrice,
        })

      if (!error) {
        count++
      }
    }
  }

  console.log(`  ✓ Created ${count} price history entries`)
}

async function seedConversationsAndMessages(userIds: string[], listingIds: string[]) {
  console.log('💬 Seeding conversations and messages...')

  // Create 5 sample conversations
  for (let i = 0; i < 5; i++) {
    const senderId = userIds[i % userIds.length]
    const receiverId = userIds[(i + 1) % userIds.length]
    const listingId = listingIds[i % listingIds.length]

    // Create messages in the conversation
    for (let j = 0; j < sampleMessages.length; j++) {
      const message = sampleMessages[j]
      const isFromSender = j % 2 === 0

      const { error } = await supabase
        .from('messages')
        .insert({
          listing_id: listingId,
          sender_id: isFromSender ? senderId : receiverId,
          receiver_id: isFromSender ? receiverId : senderId,
          content: message.content,
          read: Math.random() > 0.3, // 70% of messages are read
        })

      if (error) {
        console.error(`❌ Failed to create message:`, error.message)
      }
    }

    console.log(`  ✓ Created conversation ${i + 1}`)
  }
}

async function main() {
  console.log('🌱 Starting database seed...\n')

  try {
    // Clear existing data
    await clearDatabase()
    console.log()

    // Seed data in order
    const userIds = await seedUsers()
    console.log()

    const listingIds = await seedListings(userIds)
    console.log()

    await seedPriceHistory(listingIds)
    console.log()

    await seedConversationsAndMessages(userIds, listingIds)
    console.log()

    console.log('✨ Database seeded successfully!\n')
    console.log('📊 Summary:')
    console.log(`   • ${userIds.length} users created`)
    console.log(`   • ${listingIds.length} listings created`)
    console.log(`   • Price history entries added`)
    console.log(`   • 5 sample conversations created`)
    console.log('\n💡 Sample login credentials:')
    console.log('   Email: alice.chen@uwaterloo.ca')
    console.log('   Password: password123')
    console.log('\n   (All users have password: password123)')

  } catch (error) {
    console.error('\n❌ Seed failed:', error)
    process.exit(1)
  }
}

main()
