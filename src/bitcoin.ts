import { jsonToResponse } from './response.ts';
import { fetchJSON } from './fetch.ts';

const fetchAndComputeData = async (
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

  return jsonToResponse((data.y as number[]).map((value, index) => ({
    date: data.x[index].split('T')[0],
    value,
  })));
};

export const getBitcoinResponse = (pathname: string) => {
  switch (pathname.replace('/bitcoin', '')) {
    case '/cdd': {
      return fetchAndComputeData(
        'https://www.lookintobitcoin.com/django_plotly_dash/app/bdd/_dash-update-component',
        {
          'output': 'chart.figure',
          'outputs': { 'id': 'chart', 'property': 'figure' },
          'inputs': [{
            'id': 'url',
            'property': 'pathname',
            'value': '/charts/coin-days-destroyed-cdd/',
          }],
          'changedPropIds': ['url.pathname'],
        },
        3,
      );
    }
    case '/funding-rate': {
      return fetchAndComputeData(
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
    case '/realized-price': {
      return fetchAndComputeData(
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
  }
};
