import { apiKey } from "@better-auth/api-key";
import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins/bearer";
import type { AuthenticatedUser } from "./types.ts";

const authBaseUrl = process.env.BETTER_AUTH_URL ?? "http://127.0.0.1";

const commonAuth = betterAuth({
  appName: "common-utilities",
  baseURL: authBaseUrl,
  plugins: [bearer(), apiKey()],
  secret: process.env.BETTER_AUTH_SECRET,
  socialProviders: readSocialProviders(),
});

export function handleBetterAuthRequest(request: Request) {
  return commonAuth.handler(request);
}

export async function authorizeBetterAuthRequest(request: Request) {
  try {
    const session = await commonAuth.api.getSession({
      headers: request.headers,
    });

    return readAuthenticatedUser(session);
  } catch {
    return null;
  }
}

function readSocialProviders() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId) {
    return {};
  }

  if (!clientSecret) {
    return {};
  }

  return {
    github: {
      clientId,
      clientSecret,
    },
  };
}

function readAuthenticatedUser(session: unknown): AuthenticatedUser | null {
  if (!isRecord(session)) {
    return null;
  }

  const user = session.user;

  if (!isRecord(user)) {
    return null;
  }

  const id = readUserId(user.id);

  if (!id) {
    return null;
  }

  return {
    email: readText(user.email),
    id,
    login: readLogin(user),
    name: readText(user.name),
  };
}

function readUserId(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return null;
}

function readLogin(user: Record<string, unknown>) {
  const username = readText(user.username);

  if (username) {
    return username;
  }

  const login = readText(user.login);

  if (login) {
    return login;
  }

  return null;
}

function readText(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  const isObjectValue = typeof value === "object";
  const hasValue = value !== null;
  const isArrayValue = Array.isArray(value);
  const isRecordValue = isObjectValue && hasValue && !isArrayValue;

  return isRecordValue;
}
