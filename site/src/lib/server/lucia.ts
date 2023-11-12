import { libsql } from "@lucia-auth/adapter-sqlite";
import { lucia } from "lucia";
import { sveltekit } from "lucia/middleware";
import { dev } from "$app/environment";
import { client } from "$lib/db";

export const auth = lucia({
  adapter: libsql(client, {
    user: "users",
    session: "user_session",
    key: "user_key",
  }),
  env: dev ? "DEV" : "PROD",
  getUserAttributes: (userData) => ({
    id: userData.userId,
    ...userData,
  }),
  middleware: sveltekit(),
});

export type Auth = typeof auth;
