import { type Metadata } from 'next';

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      ...override.openGraph,
    },
    twitter: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      ...override.twitter,
    },
  };
}

export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? new URL(process.env.NEXT_PUBLIC_BASE_URL!)
    : new URL('http://localhost:3000');
