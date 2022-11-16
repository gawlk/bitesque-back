export const jsonToResponse = (json: unknown) =>
  new Response(JSON.stringify(json), {
    headers: {
      'content-type': 'application/json',
    },
  });
