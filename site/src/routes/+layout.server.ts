export const load = async ({ locals }) => {
  const session: { user: { id: string } } = await locals.auth.validate();

  return {
    session,
  };
};
