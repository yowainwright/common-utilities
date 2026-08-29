export type ServeBody = string | null;

export type AuthenticatedUser = Readonly<{
  email?: string | null;
  id: string;
  login?: string | null;
  name?: string | null;
}>;

export type RateLimitOptions = Readonly<{
  limit?: number;
  now?: () => number;
  windowMs?: number;
}>;

export type ResponseCacheOptions = Readonly<{
  maxEntries?: number;
  now?: () => number;
  ttlMs?: number;
}>;

export type ServeOptions = Readonly<{
  authHandler?: (request: Request) => Promise<Response>;
  authorize?: (request: Request) => Promise<AuthenticatedUser | null>;
  cache?: false | ResponseCacheOptions;
  rateLimit?: false | RateLimitOptions;
  requireAuth?: boolean;
}>;

export type CachedResponse = Readonly<{
  body: string;
  expiresAt: number;
  headers: [string, string][];
  maxAgeSeconds: number;
  registryVersion: string;
  status: number;
}>;

export type RateLimitBucket = Readonly<{
  count: number;
  resetAt: number;
}>;

export type RateLimitResult = Readonly<{
  headers: Record<string, string>;
  problem: Response | null;
}>;

export type PackageRoute = Readonly<{
  group: string;
  kind: string;
  rest: readonly string[];
  slug: string;
}>;
