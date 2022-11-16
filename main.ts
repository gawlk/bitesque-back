import { serve } from 'https://deno.land/std/http/server.ts';

import { getCachedResponse, setCachedResponse } from './src/cache.ts';
import { getBitcoinResponse } from './src/bitcoin.ts';
import { getYahooResponse } from './src/yahoo.ts';

serve(async (request: Request) => {
  let response = await getCachedResponse(request);

  if (response) {
    return response;
  }

  const { pathname, search } = new URL(request.url);

  if (pathname.startsWith('/bitcoin')) {
    response = await getBitcoinResponse(pathname.replace('/bitcoin', ''));
  } else if (pathname.startsWith('/yahoo')) {
    response = await getYahooResponse(pathname.replace('/yahoo', ''), search);
  }

  if (response) {
    return await setCachedResponse(request, response);
  } else {
    return new Response('❤️🦕');
  }
});

console.log('Listening on http://localhost:8000');
