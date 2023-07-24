import { jsonToResponse } from './response.ts';
import { fetchJSON } from './fetch.ts';

const fetchAndComputeLookIntoBitcoinData = async (
  url: string,
  object: unknown,
  dataIndex: number,
) => {
  const result = await fetchJSON(
    url,
    object,
  );

  const json = await result.json();

  const data = json.response.chart.figure.data[dataIndex];

  return jsonToResponse((data.y as (number | null)[]).map((value, index) => ({
    time: data.x[index].split('T')[0],
    ...(typeof value === 'number' ? { value } : {}),
  })));
};

export const getBitcoinResponse = async (pathname: string) => {
  switch (pathname.replace('/bitcoin', '')) {
    case '/realized': {
      return fetchAndComputeLookIntoBitcoinData(
        'https://www.lookintobitcoin.com/django_plotly_dash/app/realized_price/_dash-update-component',
        {
          'output': 'chart.figure',
          'outputs': { 'id': 'chart', 'property': 'figure' },
          'inputs': [{
            'id': 'url',
            'property': 'pathname',
            'value': '/charts/realized-price/',
          }],
          'changedPropIds': ['url.pathname'],
        },
        1,
      );
    }
    case '/balanced': {
      return fetchAndComputeLookIntoBitcoinData(
        'https://www.lookintobitcoin.com/django_plotly_dash/app/price_prediction/_dash-update-component',
        {
          'output': 'chart.figure',
          'outputs': { 'id': 'chart', 'property': 'figure' },
          'inputs': [{
            'id': 'url',
            'property': 'pathname',
            'value': '/charts/bitcoin-price-prediction/',
          }],
          'changedPropIds': ['url.pathname'],
        },
        4,
      );
    }
    case '/cvdd': {
      return fetchAndComputeLookIntoBitcoinData(
        'https://www.lookintobitcoin.com/django_plotly_dash/app/price_prediction/_dash-update-component',
        {
          'output': 'chart.figure',
          'outputs': { 'id': 'chart', 'property': 'figure' },
          'inputs': [{
            'id': 'url',
            'property': 'pathname',
            'value': '/charts/bitcoin-price-prediction/',
          }],
          'changedPropIds': ['url.pathname'],
        },
        1,
      );
    }
    case '/terminal': {
      return fetchAndComputeLookIntoBitcoinData(
        'https://www.lookintobitcoin.com/django_plotly_dash/app/price_prediction/_dash-update-component',
        {
          'output': 'chart.figure',
          'outputs': { 'id': 'chart', 'property': 'figure' },
          'inputs': [{
            'id': 'url',
            'property': 'pathname',
            'value': '/charts/bitcoin-price-prediction/',
          }],
          'changedPropIds': ['url.pathname'],
        },
        5,
      );
    }
    case '/funding-rates': {
      return fetchAndComputeLookIntoBitcoinData(
        'https://www.lookintobitcoin.com/django_plotly_dash/app/funding_rates/_dash-update-component',
        {
          'output': '..chart.figure...exchange.options...loading-1.style..',
          'outputs': [{ 'id': 'chart', 'property': 'figure' }, {
            'id': 'exchange',
            'property': 'options',
          }, { 'id': 'loading-1', 'property': 'style' }],
          'inputs': [{
            'id': 'url',
            'property': 'pathname',
            'value': '/charts/bitcoin-funding-rates/',
          }, {
            'id': 'currency',
            'property': 'value',
            'value': 'funding_rate_usd',
          }, { 'id': 'exchange', 'property': 'value', 'value': 'binance' }],
          'changedPropIds': ['exchange.value'],
        },
        1,
      );
    }
    case '/liquidity': {
      // Fetch cookie
      await fetch(
        'https://www.decentrader.com/charts/btcusd-liquidity-map/',
      );

      const res = await fetchJSON(
        'https://www.decentrader.com/api',
        {
          'jsonrpc': '2.0',
          'id': '0',
          'method': 'getOHLCHourlyCalculations',
          'params': ['BTCUSDT'],
        },
      );

      const json = await res.json();

      const dataset = json.result;

      const lastPrice = Number(dataset.at(-1).ohcl4);
      const lowPrice = lastPrice * 0.5;
      const highPrice = lastPrice * 1.5;

      const obj: any = {
        short: {},
        long: {},
      };

      const ifActiveAddValueToObj = (
        data: any,
        type: string,
        leverage: number,
      ) => {
        const roundedPrice = Number(data[`${type}${leverage}Rounded`]);
        const quantity = Number(data[`${type}${leverage}Active`]);

        if (
          quantity > 0 && roundedPrice >= lowPrice && roundedPrice <= highPrice
        ) {
          obj[type][roundedPrice] = (obj[type][roundedPrice] || 0) + quantity;
        }
      };

      dataset.forEach((data: any) => {
        ['long', 'short'].forEach((type) => {
          [3, 5, 10].forEach((leverage) => {
            ifActiveAddValueToObj(data, type, leverage);
          });
        });
      });

      return jsonToResponse(obj);
    }
  }
};
