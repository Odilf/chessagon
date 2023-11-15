import type { users } from '$lib/db/schema.js';

export const load = async ({ locals }) => {
  const session: {
    user: typeof users.$inferSelect
  } = await locals.auth.validate();

  return {
    session,
  };
};
