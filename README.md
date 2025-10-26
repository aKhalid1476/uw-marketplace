# UW Marketplace 🎓🛍️

A modern, AI-powered marketplace exclusively for University of Waterloo students. Buy and sell items within the campus community with intelligent pricing suggestions, automated descriptions, and real-time messaging.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-2.0-green?logo=supabase)
![Anthropic](https://img.shields.io/badge/Claude-AI-purple)

## ✨ Features

### 🤖 AI-Powered Features
- **Smart Description Generation**: Upload an item photo and get an AI-generated, compelling description using Claude Vision API
- **Intelligent Pricing**: AI suggests optimal prices based on historical marketplace data and item details
- **Image Analysis**: Advanced computer vision to understand and describe your items accurately

### 📱 Core Marketplace Features
- **Secure Authentication**: Email verification with JWT-based auth system
- **Real-time Chat**: Built-in messaging system for buyer-seller communication
- **Advanced Search & Filters**: Find exactly what you need by category, price, or keywords
- **User Profiles**: Track your listings, view stats, and manage your marketplace presence
- **Price History Tracking**: Transparent pricing trends for informed decisions

### 🎨 Modern User Experience
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile
- **Toast Notifications**: Real-time feedback for all user actions
- **Loading States**: Skeleton loaders and smooth transitions
- **Error Handling**: Friendly error messages with recovery options
- **Accessibility**: Full keyboard navigation and screen reader support

### 🔐 Security & Privacy
- **UWaterloo Email Only**: Restricted to @uwaterloo.ca email addresses
- **Password Hashing**: Secure bcrypt password storage
- **JWT Tokens**: httpOnly cookies for session management
- **Row Level Security**: Database-level access control

## 🚀 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase (PostgreSQL)
- **AI/ML**: Anthropic Claude Sonnet 4.5 (Vision API)
- **Authentication**: Custom JWT + bcrypt
- **Email**: Resend API
- **Real-time**: Supabase Realtime
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- Anthropic API key (for AI features)
- Resend API key (for email verification)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd uw-marketplace
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Fill in all required environment variables (see `.env.example` for details).

### 3. Database Setup

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Create a new project
3. Go to SQL Editor and run `lib/supabase/schema.sql`
4. Copy your project URL and keys to `.env.local`

### 4. Get API Keys

**Anthropic (Claude AI)**
1. Sign up at [console.anthropic.com](https://console.anthropic.com)
2. Create an API key
3. Add to `.env.local` as `ANTHROPIC_API_KEY`

**Resend (Email)**
1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Add to `.env.local` as `RESEND_API_KEY`

### 5. Run Locally

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### 6. Seed Demo Data (Optional)

```bash
npm run seed
```

This creates 5 sample users, 30 listings, and sample conversations. See `scripts/seed-instructions.md` for details.

**Demo Login:**
- Email: `alice.chen@uwaterloo.ca`
- Password: `password123`

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
npm run seed         # Seed database with demo data
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com)
3. Add environment variables in Vercel settings
4. Deploy!

See `docs/DEPLOYMENT.md` for detailed deployment instructions.

## 📁 Project Structure

```
uw-marketplace/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── listings/     # Listings CRUD
│   │   ├── chat/         # Messaging endpoints
│   │   └── ai/           # AI feature endpoints
│   ├── browse/           # Browse listings page
│   ├── chat/             # Chat interface
│   ├── listing/          # Listing detail pages
│   ├── listings/         # Listing management
│   ├── login/            # Login page
│   ├── signup/           # Signup flow
│   └── profile/          # User profile
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   ├── listings/         # Listing components
│   └── chat/             # Chat components
├── lib/                   # Utility libraries
│   ├── supabase/         # Supabase client & schema
│   ├── anthropic.ts      # Claude AI integration
│   └── auth.ts           # Auth utilities
├── scripts/              # Database scripts
│   └── seed.ts           # Demo data seeder
└── docs/                 # Documentation
    ├── DEPLOYMENT.md     # Deployment guide
    └── DEMO-SCRIPT.md    # Demo presentation guide
```

## 🎯 Key Features Demo

### 1. AI-Powered Listing Creation
1. Click "Sell" → "Create Listing"
2. Upload an item photo
3. Click "AI Generate" for instant description
4. Select category → AI suggests optimal price
5. Submit listing

### 2. Real-time Chat
1. Browse listings
2. Click "Contact Seller" on any listing
3. Send message instantly
4. Seller receives notification
5. Real-time conversation

### 3. Smart Search
1. Go to Browse page
2. Filter by category (Electronics, Books, etc.)
3. Search by keywords
4. View price history trends

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ |
| `ANTHROPIC_API_KEY` | Claude AI API key | ✅ |
| `RESEND_API_KEY` | Email service API key | ✅ |
| `JWT_SECRET` | JWT signing secret (32+ chars) | ✅ |

## 🐛 Troubleshooting

### "Table not found" errors
- Run the SQL schema in Supabase SQL Editor
- Check that all tables are created

### AI features not working
- Verify `ANTHROPIC_API_KEY` is set correctly
- Check API usage limits in Anthropic dashboard
- Ensure image is under 5MB

### Email verification not sending
- Verify `RESEND_API_KEY` is correct
- For development, codes are logged to console
- See `app/api/auth/send-code/route.ts`

### Authentication issues
- Clear browser cookies
- Check `JWT_SECRET` is set (32+ characters)
- Verify cookie name consistency (`auth_token`)

## 📸 Screenshots

<!-- Add your screenshots here -->

### Homepage
![Homepage](screenshots/homepage.png)

### Browse Listings
![Browse](screenshots/browse.png)

### AI Description Generation
![AI Features](screenshots/ai-description.png)

### Chat Interface
![Chat](screenshots/chat.png)

### Create Listing
![Create Listing](screenshots/create-listing.png)

## 🤝 Contributing

This is a student project for UWaterloo. Contributions, issues, and feature requests are welcome!

## 📝 License

This project is for educational purposes. Created for the University of Waterloo community.

## 🙏 Acknowledgments

- **Anthropic** for Claude AI API
- **Supabase** for backend infrastructure
- **Vercel** for deployment platform
- **Next.js** team for the amazing framework
- **UWaterloo** community for inspiration

## 📧 Contact

For questions or feedback, please open an issue or contact the development team.

---

**Built with ❤️ for UWaterloo students**
