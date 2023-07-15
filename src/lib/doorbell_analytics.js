class DoorbellAnalytics {
  timestamp;
  constructor({headers, queryStringParameters}, domain) {
    const {host} = headers;
    this.netlifyHeaders = headers;
    this.netlifyQueryStringParameters = queryStringParameters;
    this.validDomain = `https://${domain}`;
    this.netlifyReferrer = `https://${host.replace('www.', '')}`;
  }
  static pixelResponse = {
    statusCode: 200,
    body: 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    headers: {'content-type': 'image/gif'},
    isBase64Encoded: true,
  };
  static teapotResponse = {
    statusCode: 418,
    body: JSON.stringify({status: "I'm a teapot"}),
  };
  get isValidDomain() {
    return this.validDomain == this.netlifyReferrer;
  }
  get sheetRow() {
    this.timestamp = new Date().toISOString();
    const {
      host,
      'user-agent': ua,
      'x-language': locale,
      'x-country': country,
    } = this.netlifyHeaders;

    const {
      pathname: page,
      search,
      hash,
      screen,
      timezone,
      platform,
      brands,
      time,
    } = this.netlifyQueryStringParameters;

    const params = JSON.stringify({
      search,
      timezone,
      platform,
      screen,
      brands,
      time,
    });

    return {
      timestamp: this.timestamp,
      page,
      hash,
      params,
      ua,
      locale,
      country,
      headers: JSON.stringify(this.netlifyHeaders),
    };
  }
}
export {DoorbellAnalytics};
