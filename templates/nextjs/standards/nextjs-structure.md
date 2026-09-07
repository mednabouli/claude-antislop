# Next.js Project Structure

## Directory Layout

```
src/
├── app/                    # App Router pages
│   ├── (auth)/            # Route group for auth pages
│   ├── (dashboard)/       # Route group for dashboard
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                  # Utilities and helpers
│   ├── api/              # API client functions
│   ├── utils/            # General utilities
│   └── validations/      # Zod schemas
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
├── styles/               # Global styles
└── config/               # App configuration
```

## Conventions

- Use App Router (not Pages Router)
- Group related routes with `(parentheses)`
- Keep page components minimal; extract logic to components
- Use server components by default; add `"use client"` when needed
- Co-locate tests with components (`Component.test.tsx`)
- Use absolute imports (`@/components/ui/Button`)

## Environment Variables

- Prefix with `NEXT_PUBLIC_` for client-side
- Keep secrets server-side only
- Validate with Zod schemas
- Document in `.env.example`

## API Routes

- Use Route Handlers in `app/api/`
- Return consistent JSON structure
- Handle errors with try-catch
- Validate input with Zod

## Styling

- Use Tailwind CSS for utility-first styling
- Extract repeated patterns to components
- Use `clsx` or `classnames` for conditional classes
- Maintain design tokens in `tailwind.config.ts`
