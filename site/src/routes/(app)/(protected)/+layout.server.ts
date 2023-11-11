import { redirect } from "@sveltejs/kit";
import { _redirect_after_login_key } from "../login/+page.server.js";

export async function load({ parent, url }) {
  const { session } = await parent();

  if (!session?.user) {
    throw redirect(303, `/login?${_redirect_after_login_key}=${url.pathname}`);
  }

  return {
    session,
  };
}
