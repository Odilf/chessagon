import { auth } from "$lib/server/lucia";
import { fail, redirect } from "@sveltejs/kit";
import { LuciaError } from "lucia";

import { loginSchema, registerSchema } from "./schemas";

export async function load({ parent }) {
  const { session } = await parent();

  if (session) {
    throw redirect(302, "/profile");
  }
}

export const _redirect_after_login_key = "redirect-after-login";

function redirectAfterLogin(navigateAfterLogin: string | null) {
  if (navigateAfterLogin) {
    return redirect(302, navigateAfterLogin);
  }

  return redirect(302, "/profile");
}

// TODO: Tidy up this
export const actions = {
  register: async ({ request, locals, url }) => {
    const result = registerSchema.safeParse(await request.formData());
    if (result.success === false) {
      return fail(400, {
        error: {
          message: result.error.message,
        }
      });
    }

    const { username, email, password } = result.data;

    try {
      const user = await auth.createUser({
        key: {
          providerId: "email", // auth method
          providerUserId: email, // unique id when using "username" auth method
          password, // hashed by Lucia
        },
        attributes: {
          name: username,
          email,
        },
      });
      const session = await auth.createSession({
        userId: user.userId,
        attributes: {},
      });
      locals.auth.setSession(session); // set session cookie
    } catch (e) {
      // this part depends on the database you're using
      // check for unique constraint error in user table
      if (
        e
        // e instanceof SomeDatabaseError &&
        // e.message === USER_TABLE_UNIQUE_CONSTRAINT_ERROR
      ) {
        return fail(400, {
          error: {
            message: "Username already taken",
          }
        });
      }
      return fail(500, {
        error: {
          message: "An unknown error occurred",
        }
      });
    }

    throw redirectAfterLogin(url.searchParams.get(_redirect_after_login_key));
  },

  login: async ({ request, locals, url }) => {
    const result = loginSchema.safeParse(await request.formData());
    if (result.success === false) {
      return fail(400, {
        error: {
          message: result.error.message,
        }
      });
    }

    const { email, password } = result.data;

    try {
      // find user by key
      // and validate password
      const key = await auth.useKey("email", email, password);
      const session = await auth.createSession({
        userId: key.userId,
        attributes: {},
      });
      locals.auth.setSession(session); // set session cookie
    } catch (e) {
      if (
        e instanceof LuciaError &&
        (e.message === "AUTH_INVALID_KEY_ID" ||
          e.message === "AUTH_INVALID_PASSWORD")
      ) {
        return fail(400, {
          error: {
            message: "Incorrect username or password",
          }
        });
      }
      return fail(500, {
        error: {
          message: "An unknown error occurred",
        }
      });
    }

    throw redirectAfterLogin(url.searchParams.get(_redirect_after_login_key));
  },

  logout: async ({ locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
      return fail(401);
    }

    locals.auth.setSession(null); // remove cookie
    throw redirect(302, '/login'); // redirect to login page
  },
};
