export const fetchJSON = (url: string, body: unknown) =>
  fetch(
    url,
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
  );
