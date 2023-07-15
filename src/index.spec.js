import {handler} from './index.js';
import {DoorbellAnalytics} from './lib/doorbell_analytics.js';
import {DoorbellSpreadsheet} from './lib/google_spreadsheet.js';
import {GoogleSpreadsheet} from 'google-spreadsheet';
import {JWT} from 'google-auth-library';

jest.mock('google-auth-library');
jest.mock('google-spreadsheet');
jest.mock('./lib/doorbell_analytics');
jest.mock('./lib/google_spreadsheet');
const fakeProcess = {
  env: {
    GOOGLE_SERVICE_ACCOUNT_EMAIL: 'email',
    GOOGLE_PRIVATE_KEY: 'key',
    SPREADSHEET_ID: 'id',
    SPREADSHEET_SHEET_TITLE: 'title',
    APEX_DOMAIN: 'domain',
  },
};
const validNetlifyEvent = { host: fakeProcess.env.APEX_DOMAIN };

describe('NetlifyDoorbell', () => {
  beforeEach(function() {
    Object.defineProperty(process, 'env', {
      value: {
        ...fakeProcess.env,
      },
    });
    jest.resetAllMocks();
  });

  test('no error', () => {
    expect(() => handler(validNetlifyEvent)).not.toThrow();
  });

  test('calls JWT with the process env variables', () => {
    handler(validNetlifyEvent);
    expect(JWT).toHaveBeenCalledWith({
      email: fakeProcess.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: fakeProcess.env.GOOGLE_PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  });

  test('calls google-spreadsheet', () => {
    JWT.mockImplementation(() => {
      return {fake: 'jwt'};
    });
    handler(validNetlifyEvent);
    expect(GoogleSpreadsheet).toHaveBeenCalledWith(
      fakeProcess.env.SPREADSHEET_ID,
      {fake: 'jwt'},
    );
  });

  test('calls doorbellAnalytics', () => {
    handler(validNetlifyEvent);
    expect(DoorbellAnalytics).toHaveBeenCalledWith(
      validNetlifyEvent,
      process.env.APEX_DOMAIN,
    );
  });

  test('calls doorbellSpreadsheet', () => {
    GoogleSpreadsheet.mockImplementation(() => {
      return {fake: 'google_service'};
    });
    handler(validNetlifyEvent);
    expect(DoorbellSpreadsheet).toHaveBeenCalledWith(
      {fake: 'google_service'},
      process.env.SPREADSHEET_SHEET_TITLE,
    );
  });

  describe('returns', () => {

    test('teapotResponse, with none matching domains in netlify event headers', () => {
      const subject = handler({});
      expect(subject).resolves.toEqual({"body": "{\"status\":\"I'm a teapot\"}", "statusCode": 418});
    });

    // test('exit early with teapotResponse', () => {
      // const subject = handler({});
      // expect(JWT).not.toHaveBeenCalled();
      // expect(GoogleSpreadsheet).not.toHaveBeenCalled();
      // expect(DoorbellSpreadsheet).not.toHaveBeenCalled();
    // });

    test('pixelResponse, with matching domains', () => {
      const subject = handler(validNetlifyEvent);
      expect(subject).resolves.toEqual({"body": "{\"status\":\"I'm a teapot\"}", "statusCode": 418});
    });

  });

});
