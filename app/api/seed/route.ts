/**
 * Seed Database API Endpoint
 *
 * Protected endpoint to seed the database with sample data
 * Only works in development or with correct secret key
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import * as bcrypt from 'bcryptjs'

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

export async function POST(request: Request) {
  try {
    // Security check - require secret key or development mode
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')

    // Only allow in development OR with correct secret
    if (process.env.NODE_ENV === 'production' && secret !== process.env.SEED_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get Supabase service role key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { success: false, error: 'Missing Supabase configuration' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const results = {
      users: 0,
      listings: 0,
      messages: 0,
    }

    // Create users
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
        } as any)
        .select()
        .single()

      if (!error && data) {
        userIds.push((data as any).id)
        results.users++
      }
    }

    // Create listings
    const listingIds: string[] = []
    for (let i = 0; i < sampleListings.length; i++) {
      const listing = sampleListings[i]
      const sellerId = userIds[i % userIds.length]

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
        } as any)
        .select()
        .single()

      if (!error && data) {
        listingIds.push((data as any).id)
        results.listings++
      }
    }

    // Create some sample messages
    if (userIds.length >= 2 && listingIds.length >= 1) {
      const messages = [
        { content: 'Hi! Is this still available?', sender: 0, receiver: 1 },
        { content: 'Yes it is! Are you interested?', sender: 1, receiver: 0 },
        { content: 'Great! Can we meet on campus to see it?', sender: 0, receiver: 1 },
      ]

      for (const msg of messages) {
        const { error } = await supabase
          .from('messages')
          .insert({
            listing_id: listingIds[0],
            sender_id: userIds[msg.sender],
            receiver_id: userIds[msg.receiver],
            content: msg.content,
            read: false,
          } as any)

        if (!error) {
          results.messages++
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      results,
      credentials: {
        email: 'alice.chen@uwaterloo.ca',
        password: 'password123',
      },
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to seed database',
      },
      { status: 500 }
    )
  }
}
