import { db } from '$lib/db/index.js';
import { games, users } from '$lib/db/schema.js';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { createId } from '@paralleldrive/cuid2';
import { error, redirect } from '@sveltejs/kit';
import { eq, or } from 'drizzle-orm';

export async function load({ parent }) {
	const { session } = await parent();

	const [result] = await db.select()
		.from(users)
		.where(eq(users.id, session.user.id))
		.innerJoin(
			games,
			or(
				eq(games.white, users.id),
				eq(games.black, users.id)
			)
		).limit(1);

	if (result) {
		throw redirect(302, `/play/${result.games.id}`);
	}

	// TODO: Query all available games (or rather, game ids)
}

const timeControlSchema = zfd.formData({
	minutes: zfd.numeric(z.number().int().nonnegative()),
	increment: zfd.numeric(z.number().int().nonnegative()),
})

export const actions = {
	createGame: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		if (!session) {
			throw error(401, 'Not logged in');
		}

		const { minutes, increment } = timeControlSchema.parse(await request.formData());
		const color = Math.random() > 0.5 ? 'white' : 'black';

		const gameId = createId();
		const result = await db.insert(games).values({
			id: gameId,
			tc_increment: increment,
			tc_minutes: minutes,
			[color]: session.user.id,
		})

		throw redirect(303, `/play/${gameId}`);
	},
}
