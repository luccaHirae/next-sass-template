# Copilot Instructions

This document guides GitHub Copilot to generate code consistently for this project.

## Project Overview

- **Type:** SaaS starter template
- **Framework:** Next.js (App Router)
- **Styling:** TailwindCSS + ShadCN/UI
- **Auth:** Better Auth
- **Payments:** Stripe
- **Database/ORM:** PostgreSQL with Prisma

## File Structure

- `app/` → Next.js routing and pages
- `components/` → ShadCN and custom UI components
- `lib/` → utilities and helpers
- `hooks/` → custom React hooks

## Coding Conventions

- Use **functional components only**
- Use **TypeScript** with explicit prop typing (`interface Props`)
- Use **server components by default**; only use client components when necessary
- Use **path aliases** (`@/components`, `@/lib`, etc.)
- Keep formatting minimal and standard (ESLint/Prettier defaults)

## Notes for Copilot

- Prefer generating reusable UI with ShadCN components and TailwindCSS utilities
- Keep auth-related code aligned with **Better Auth** best practices
- Implement payment flows using **Stripe**
- Use **Prisma** schema and client for database access
- Keep code modular and consistent with the given file structure
