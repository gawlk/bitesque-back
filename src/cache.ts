import { HEADERS_DATE_KEY } from './constants.ts';
import { addCORSToHeaders, addDateToHeaders } from './headers.ts';

const cacheKey = 'cache';
let cache: Cache | undefined;

if (typeof caches !== undefined) {
  await caches.delete(cacheKey);
  cache = await caches.open(cacheKey);
}

export const getCachedResponse = async (request: Request) => {
  enum One {
    Second = 1000,
    Minute = 60 * One.Second,
    Hour = 60 * One.Minute,
    Day = 24 * One.Hour,
  }

  const response = await cache?.match(request);

  const { pathname, search } = new URL(request.url);

  const strDate = response?.headers.get(HEADERS_DATE_KEY);

  const remaining = strDate
    ? new Date(strDate).valueOf() + 5 * One.Minute - new Date().valueOf()
    : 0;

  if (response && remaining > 0) {
    console.log(
      `${pathname}${search} - cache (remaining: ${
        Math.floor(remaining / One.Minute * 10) / 10
      }mn)`,
    );

    response.headers.set('x-cache-hit', 'true');

    return response;
  } else {
    console.log(`${pathname}${search} - live`);

    await cache?.delete(request);
  }
};

export const setCachedResponse = async (
  request: Request,
  response: Response,
) => {
  const headers = new Headers(response.headers);

  addDateToHeaders(headers);
  addCORSToHeaders(headers);

  response = new Response(response.body, { ...response, headers });

  await cache?.put(
    request,
    response.clone(),
  );

  return response;
};
