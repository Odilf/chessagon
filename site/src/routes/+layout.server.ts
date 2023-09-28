export const load = async ({ locals: { getSession } }) => {
  console.log("Session is ", await getSession());

  return {
    session: await getSession(),
  };
};
