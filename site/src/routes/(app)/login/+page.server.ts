import { error, fail } from "@sveltejs/kit";

function formDataAsString(formData: FormData, key: string) {
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

function getData(formData: FormData) {
  const email = formDataAsString(formData, "email");
  const password = formDataAsString(formData, "password");

  return { email, password };
}

export const actions = {
  register: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const { email, password } = getData(formData);
    const username = formDataAsString(formData, "username");

    const { data, error: supabaseErr } = await supabase.auth.signUp({
      email,
      password,
    });

    // TODO: Write the thing into the profile

    if (supabaseErr) {
      return fail(400, {
        email,
        username,
        error: { message: supabaseErr.message },
      });
    }

    return { successs: true, data };
  },

  login: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const { email, password } = getData(formData);

    const { data, error: supabaseErr } = await supabase.auth.signInWithPassword(
      {
        email,
        password,
      },
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
