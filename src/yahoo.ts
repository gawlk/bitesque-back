export const getYahooResponse = (pathname: string, search: string) => {
  switch (pathname.replace('/yahoo', '')) {
    case '/search': {
      return fetch(
        `https://query2.finance.yahoo.com/v1/finance/search${search}`,
      );
    }
    case '/quote': {
      return fetch(
        `https://query1.finance.yahoo.com/v7/finance/quote${search}`,
      );
    }
    case '/download': {
      const params = new URLSearchParams(search);

      const symbol = params.get('symbol');

      params.delete('symbol');

      params.set('period1', '0');
      params.set('period2', `${new Date().valueOf()}`);
      params.set('interval', '1d');
      params.set('events', 'history');
      params.set('includeAdjustedClose', 'true');

      return fetch(
        `https://query1.finance.yahoo.com/v7/finance/download/${symbol}?${params.toString()}`,
      );
    }
  }
};
