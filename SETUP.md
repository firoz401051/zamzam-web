# zamzam Setup Guide

Follow these steps to get your zamzam e-commerce store up and running.

## Prerequisites

- **Node.js**: Version 18.17.0 or higher.
- **pnpm**: Version 8 or higher (Recommended).
  - If you don't have pnpm, install it: `npm install -g pnpm`

## 1. Installation

Unzip the downloaded `zamzam.zip` file and navigate into the project directory:

```bash
cd zamzam
pnpm install
```

> **Note**: You can also use `npm install`, `yarn`, or `bun install` if you prefer.

## 2. Environment Setup

Create a `.env` file in the root directory by copying the example:

```bash
cp .env.example .env
```

Now, open `.env` and populate it with your credentials:

1.  **Sanity**: Log in to [Sanity.io](https://sanity.io), create a new project, and get your Project ID and API Token.
2.  **Clerk**: Create an application in [Clerk](https://clerk.com) and get your Publishable Key and Secret Key.
3.  **Stripe**: Get your Test API Keys from the [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys).

## 3. Import Sample Data (Optional)

If you want to start with pre-populated content (products, categories, etc.), you can import the provided seed data:

```bash
npx sanity@latest dataset import seed.tar.gz production
```

## 4. Sanity Schema Generation

To generate TypeScript types from your Sanity schema:

```bash
# Extract the schema type definitions and generate types
pnpm typegen
```

You can verify your studio is working by visiting: `http://localhost:3000/studio`

## 5. Running Development Server

Start the application locally:

```bash
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## 6. Stripe Webhook (Optional)

To test payments locally, you need to forward Stripe webhooks to your local machine:

1.  Install the Stripe CLI.
2.  Run the forward command:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

3.  Copy the **Stripe Webhook Secret** (`whsec_...`) from the CLI output and paste it into your `.env` file as `STRIPE_WEBHOOK_SECRET`.

## Troubleshooting

- **Build Errors**: Identify missing keys in `.env`.
- **Lint Errors**: Run `pnpm lint` to check for code issues.
