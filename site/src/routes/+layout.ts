import { dev } from "$app/environment";

export const load = async ({ fetch, data, depends, parent }) => {
  const { session } = data;

  return {
    session,
  };
};
