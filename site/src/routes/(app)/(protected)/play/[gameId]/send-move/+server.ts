export async function POST({ params, request }) {
	
	return new Response(null, { status: 403, statusText: "Illegal move" })
}
