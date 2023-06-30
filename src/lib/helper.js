import fetch from 'node-fetch';

const urlRequest = ({url, params}) => {
  const newUrl = new URL(url);
  if (params) {
    for (let key in params) {
      newUrl.searchParams.set(key, params[key]);
    }
  }
  return newUrl.href;
};

const fetchRequest = ({url, method = 'GET', headers, params }) => {
  let queryUrl = urlRequest({url, params});

  return fetch(queryUrl, {
    method,
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      ...headers,
    },
  })
    .then(async res => {
      try {
        return res.json();
      } catch (error) {
        return res;
      }
    })
    .catch(e => e);
};

export {fetchRequest};
