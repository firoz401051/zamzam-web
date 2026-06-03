# zamzam - Advanced E-Commerce Platform

zamzam is a premium, full-stack e-commerce solution built with the latest web technologies. It features a stunning, responsive design, real-time administrative dashboard, and seamless payment integration.

![zamzam Preview](./public/preview.png)

## 🚀 Key Features

- **Modern & Responsive Design**: Built with Tailwind CSS and Shadcn/UI for a premium look and feel across all devices.
- **Robust Authentication**: Secure user management powered by [Clerk](https://clerk.com).
- **Headless CMS**: Flexible content management for products, categories, and orders using [Sanity.io](https://sanity.io).
- **Advanced Admin Dashboard**:
  - **Real-time Analytics**: Visual Sales Reports, Revenue Trends, and User Growth charts using `recharts`.
  - **Order Management**: Detailed order processing, status updates, and search functionality.
  - **Database Monitoring**: System health checks and document statistics.
- **Seamless Checkout**: Integrated Stripe payments with webhook support for real-time order confirmation.
- **Performance Optimized**: Server-side rendering, image optimization, and efficient data fetching with Next.js 16.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.1](https://nextjs.org) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) & [Shadcn/UI](https://ui.shadcn.com)
- **CMS (Backend)**: [Sanity](https://sanity.io)
- **Auth**: [Clerk](https://clerk.com)
- **Payments**: [Stripe](https://stripe.com)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev)
- **Analytics**: [Firebase](https://firebase.google.com)
- **Email**: [Nodemailer](https://nodemailer.com)

## 📦 Compatibility

| Manager | Status |
| :--- | :--- |
| **pnpm** | ✅ **Recommended** |
| npm | ✅ Supported |
| yarn | ✅ Supported |
| bun | ✅ Supported |

## 📂 Project Structure

```bash
zamzam/
├── app/                  # Next.js App Router
│   ├── (admin)/          # Admin Dashboard routes
│   │   └── admin/        # /admin pages (Analytics, Orders, Reports)
│   ├── (client)/         # Public Storefront routes
│   │   ├── (user)/       # User Profile routes
│   │   └── ...           # Public pages (Home, Product, Cart)
│   ├── api/              # API Routes (Stripe Webhooks, Cron jobs)
│   └── layout.tsx        # Root layout
├── components/           # Reusable React components
│   ├── ui/               # Shadcn UI primitives
│   └── ...               # Feature-specific components
├── lib/                  # Utility functions
├── sanity/               # Sanity Studio configuration
│   ├── schemaTypes/      # Database schemas
│   └── lib/              # Client & Image helpers
├── store/                # Zustand state (Cart)
└── public/               # Static assets
```

## 🏁 Getting Started

See [SETUP.md](./SETUP.md) for detailed installation and usage instructions.
