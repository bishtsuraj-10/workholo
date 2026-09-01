import { expo } from "@better-auth/expo";
import { createDb } from "@workholo/db";
import {
	account,
	accountRelations,
	session,
	sessionRelations,
	user,
	userRelations,
	verification,
} from "@workholo/db/schema/auth";
import { env } from "@workholo/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export function createAuth() {
	const db = createDb();
	const useSecureCookies = env.BETTER_AUTH_URL.startsWith("https://");

	return betterAuth({
		advanced: {
			defaultCookieAttributes: {
				httpOnly: true,
				sameSite: useSecureCookies ? "none" : "lax",
				secure: useSecureCookies,
			},
		},
		baseURL: env.BETTER_AUTH_URL,
		database: drizzleAdapter(db, {
			provider: "pg",
			schema: {
				account,
				accountRelations,
				session,
				sessionRelations,
				user,
				userRelations,
				verification,
			},
		}),
		emailAndPassword: {
			enabled: true,
		},
		plugins: [expo()],
		secret: env.BETTER_AUTH_SECRET,
		trustedOrigins: [
			env.CORS_ORIGIN,
			"workholo://",
			"exp://",
			"http://localhost:8081",
		],
	});
}

export const auth = createAuth();
