import type { PostgrestError } from "@supabase/supabase-js";
import { error as skError } from "@sveltejs/kit";

export function formatError(error: PostgrestError): string {
  const mainMessage = error.message
    ? `Error: ${error.message}`
    : "Uknown error";
  const hint = error.hint ? `. Hint: ${error.hint}` : "";
  const details = error.details ? `(${error.details})` : "";

  return `${mainMessage} ${hint} ${details}`;
}

export function handleSupabaseResponse<T>({
  data,
  error,
}: {
  data: T;
  error: PostgrestError | null;
}): T {
  if (error) {
    console.warn(error);
    const message = formatError(error);

    throw skError(500, message);
  }

  return data;
}
