import { error, fail } from "@sveltejs/kit";

function getAsString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value === "string") {
    return value;
  }

  const type = value === null ? "null" : typeof value;

  throw error(
    400,
    `formData with key ${key} was ${type} instead of string (specifically, ${value})`,
  );
}

export const actions = {
  register: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const email = getAsString(formData, "email");
    const password = getAsString(formData, "password");

    const { data, error: supabaseErr } = await supabase.auth.signUp({
      email,
      password,
    });

    if (supabaseErr) {
      return fail(400, { email, error: { message: supabaseErr.message } });
    }

    return { successs: true, data };
  },

  login: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const email = getAsString(formData, "email");
    const password = getAsString(formData, "password");

    const { data, error: supabaseErr } = await supabase.auth.signInWithPassword(
      { email, password },
    );

    if (supabaseErr) {
      return fail(400, { email, error: { message: supabaseErr.message } });
    }

    return { successs: true, data };
  },

  logout: async ({ locals: { supabase } }) => {
    const { error: supabaseErr } = await supabase.auth.signOut();

    if (supabaseErr) {
      return fail(400, { error: { message: supabaseErr.message } });
    }

    return { successs: true };
  },
};
