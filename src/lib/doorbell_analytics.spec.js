import {DoorbellAnalytics} from './doorbell_analytics.js';
describe('Doorbell Analytics', () => {
  const domain = 'example.com';
  const netlifyHeaders = {
    headers: {
      host: domain,
      'user-agent': '',
      'x-language': '',
      'x-country': '',
    },
    queryStringParameters: {
      pathname: '',
      hash: '',
      brands: '',
      platform: '',
      screen: '',
      search: '',
      time: '',
      timezone: '',
    },
  };

  const expectedSheetRow = {
    timestamp: 'timestamp',
    page: '',
    hash: '',
    params: JSON.stringify({
      search: '',
      timezone: '',
      platform: '',
      screen: '',
      brands: '',
      time: '',
    }),
    ua: '',
    locale: '',
    country: '',
    headers: JSON.stringify(netlifyHeaders.headers),
  };

  beforeEach(function() {
    jest.resetAllMocks();
  });

  test('no error', () => {
    expect(() => new DoorbellAnalytics(netlifyHeaders, domain)).not.toThrow();
  });

  describe('statics', () => {
    test('.teapotResponse', () => {
      expect(DoorbellAnalytics.teapotResponse).toBeTruthy();
    });

    test('.pixelResponse', () => {
      expect(DoorbellAnalytics.pixelResponse).toBeTruthy();
    });
  });

  describe('.isValidDomain', () => {
    test('with matching domain', () => {
      const subject = new DoorbellAnalytics(netlifyHeaders, domain);
      expect(subject.isValidDomain).toBeTruthy();
    });

    test('without matching domain', () => {
      const subject = new DoorbellAnalytics(netlifyHeaders, 'tld.com');
      expect(subject.isValidDomain).toBeFalsy();
    });
  });

  describe('.sheetRow', () => {
    test('creates timestamp', () => {
      const subject = new DoorbellAnalytics(netlifyHeaders, domain);
      const expectedDate = 'timestamp';
      const mockToISOString = jest
        .spyOn(Date.prototype, 'toISOString')
        .mockImplementation(() => expectedDate);
      subject.sheetRow;
      expect(mockToISOString).toHaveBeenCalled();
      expect(subject.timestamp).toEqual(expectedDate);
    });
    test('creates referrer with https', () => {
      const subject = new DoorbellAnalytics(netlifyHeaders, domain);
      expect(subject.netlifyReferrer).toEqual(
        `https://${netlifyHeaders.headers.host}`,
      );
    });

    test('creates referrer removes www.', () => {
      const subject = new DoorbellAnalytics(
        {headers: {host: 'www.example.com'}},
        domain,
      );
      expect(subject.netlifyReferrer).toEqual(
        `https://${netlifyHeaders.headers.host}`,
      );
    });

    test('json stringify original queryStringParameters', () => {
      const subject = new DoorbellAnalytics(netlifyHeaders, domain);
      const mockToISOString = jest.spyOn(JSON, 'stringify');
      subject.sheetRow;
      expect(mockToISOString.mock.calls[0]).toEqual([
        {
          brands: '',
          platform: '',
          screen: '',
          search: '',
          time: '',
          timezone: '',
        },
      ]);
    });

    test('json stringify original queryStringParameters', () => {
      const subject = new DoorbellAnalytics(netlifyHeaders, domain);
      const mockToISOString = jest.spyOn(JSON, 'stringify');
      subject.sheetRow;
      expect(mockToISOString.mock.calls[1]).toEqual([
        {
          ...netlifyHeaders.headers,
        },
      ]);
    });

    test('creates expected sheet row', () => {
      const subject = new DoorbellAnalytics(netlifyHeaders, domain);
      const mockToISOString = jest
        .spyOn(Date.prototype, 'toISOString')
        .mockImplementation(() => 'timestamp');
      subject.sheetRow;
      expect(subject.sheetRow).toMatchObject(expectedSheetRow);
    });
  });
});
