# UW Marketplace

A modern marketplace application built with Next.js 14, TypeScript, and Tailwind CSS.

## Overview

UW Marketplace is a full-stack web application that provides a platform for buying and selling items. Built with modern technologies and best practices, it offers a seamless user experience with real-time features and AI-powered capabilities.

## Tech Stack

### Core
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality UI components

### Backend & Services
- **Supabase** - Database and authentication
- **Anthropic Claude** - AI-powered features
- **Resend** - Email delivery service

### Utilities
- **Zod** - Schema validation
- **date-fns** - Date manipulation
- **lucide-react** - Icon library

## Project Structure

```
uw-marketplace/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions
│   └── utils.ts          # Helper utilities
├── types/                 # TypeScript type definitions
├── public/               # Static assets
└── .env.local           # Environment variables (not in git)
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager
- Git for version control

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd uw-marketplace
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:

Copy the `.env.local` file and fill in your actual API keys:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Anthropic API Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Resend Email Configuration
RESEND_API_KEY=your_resend_api_key_here
```

### Getting API Keys

- **Supabase**: Sign up at [supabase.com](https://supabase.com) and create a new project
- **Anthropic**: Get your API key from [console.anthropic.com](https://console.anthropic.com)
- **Resend**: Sign up at [resend.com](https://resend.com) to get your API key

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

Create an optimized production build:

```bash
npm run build
npm run start
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## UI Components

The project includes the following shadcn/ui components:

- Button
- Input
- Card
- Dialog
- Textarea
- Badge
- Avatar
- Separator

To add more components:

```bash
npx shadcn@latest add [component-name]
```

## Learn More

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Supabase Documentation](https://supabase.com/docs)
- [Anthropic Documentation](https://docs.anthropic.com)

### Tutorials
- [Next.js Learn](https://nextjs.org/learn) - Interactive Next.js tutorial
- [Supabase Tutorial](https://supabase.com/docs/guides/getting-started)

## Deployment

### Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your environment variables
4. Deploy!

For detailed instructions, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

### Other Platforms

You can also deploy to:
- AWS
- Google Cloud Platform
- Azure
- Railway
- Render

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
