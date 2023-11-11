import { dev } from "$app/environment";

export const load = async ({ data }) => {
  const { session } = data;

  return {
    session,
  };
};
