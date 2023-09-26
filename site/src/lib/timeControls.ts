type TimeControl = {
	minutes: number,
	increment: number,
}

export const timeControls: readonly TimeControl[] = [
	{ minutes: 1, increment: 0 },
	{ minutes: 2, increment: 1 },
	{ minutes: 3, increment: 0 },
	{ minutes: 3, increment: 2 },
	{ minutes: 5, increment: 0 },
	{ minutes: 5, increment: 3 },
	{ minutes: 10, increment: 0 },
	{ minutes: 10, increment: 5 },
	{ minutes: 15, increment: 10 },
	{ minutes: 30, increment: 0 },
	{ minutes: 30, increment: 20 },
] as const;
