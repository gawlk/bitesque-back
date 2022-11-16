import { HEADERS_DATE_KEY } from './constants.ts';

export const addCORSToHeaders = (headers: Headers) => {
  if (!headers.has('access-control-allow-origin')) {
    headers.set('access-control-allow-origin', '*');
    headers.set('access-control-allow-headers', '*');
  }
};

export const addDateToHeaders = (headers: Headers) => {
  headers.set(HEADERS_DATE_KEY, new Date().toJSON());
};
