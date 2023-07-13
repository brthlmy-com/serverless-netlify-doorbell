import {DoorbellSpreadsheet} from './google_spreadsheet.js';
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet';
import {JWT} from 'google-auth-library';

const serviceAccountAuth = new JWT({
  // env var values here are copied from service account credentials generated by google
  // see "Authentication" section in docs for more info
  email: 'service@accounts.google.com',
  key: `-----BEGIN RSA PRIVATE KEY-----
    MIIBOgIBAAJBAKj34GkxFhD90vcNLYLInFEX6Ppy1tPf9Cnzj4p4WGeKLs1Pt8Qu
    KUpRKfFLfRYC9AIKjbJTWit+CqvjWYzvQwECAwEAAQJAIJLixBy2qpFoS4DSmoEm
    o3qGy0t6z09AIJtH+5OeRV1be+N4cDYJKffGzDa88vQENZiRm0GRq6a+HPGQMd2k
    TQIhAKMSvzIBnni7ot/OSie2TmJLY4SwTQAevXysE2RbFDYdAiEBCUEaRQnMnbp7
    9mxDXDf6AU0cN/RPBjb9qSHDcWZHGzUCIG2Es59z8ugGrDY+pxLQnwfotadxd+Uy
    v/Ow5T0q5gIJAiEAyS4RaI9YG8EWx/2w0T67ZUVAw8eOMB6BIUg0Xcu+3okCIBOs
    /5OiPgoTdSy7bcF9IGpSE8ZgGKzgYQVZeN97YE00
    -----END RSA PRIVATE KEY-----`,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

describe('Google Spreadsheet', () => {
  beforeEach(function() {
    jest.resetAllMocks();
  });

  test('calls .loadInfo', async () => {
    const service = new GoogleSpreadsheet('id', serviceAccountAuth);
    const googleSpreadsheetSpy = jest
      .spyOn(GoogleSpreadsheet.prototype, 'loadInfo')
      .mockImplementation();
    jest
      .spyOn(GoogleSpreadsheet.prototype, 'sheetsByTitle', 'get')
      .mockImplementation(() => 'some-mocked-result');
    new DoorbellSpreadsheet(service).handle();
    expect(googleSpreadsheetSpy).toHaveBeenCalled();
  });

  test('calls .sheetsByTitle with correct spreadsheet title', async () => {
    const service = new GoogleSpreadsheet('id', serviceAccountAuth);
    jest.spyOn(GoogleSpreadsheet.prototype, 'loadInfo').mockResolvedValue(true);
    const getterMethodMock = jest
      .spyOn(GoogleSpreadsheet.prototype, 'sheetsByTitle', 'get')
      .mockImplementation(() => 'some-mocked-result');
    const subject = new DoorbellSpreadsheet(service);
    await subject.handle();
    expect(getterMethodMock).toHaveBeenCalled();
  });

  test('calls .addRow on the spreadsheet title', async () => {
    const mockAddRow = jest.fn();
    const service = new GoogleSpreadsheet('id', serviceAccountAuth);
    jest.spyOn(GoogleSpreadsheet.prototype, 'loadInfo').mockResolvedValue(true);
    jest
      .spyOn(GoogleSpreadsheet.prototype, 'sheetsByTitle', 'get')
      .mockImplementation(() => {
        return {'my-sheet-title': {addRow: mockAddRow}};
      });

    const subject = new DoorbellSpreadsheet(service, 'my-sheet-title');
    await subject.handle();
    expect(mockAddRow).toHaveBeenCalled();
  });

  test('calls .addRow with row object', async () => {
    const mockAddRow = jest.fn();
    const expectedRow = { 'col1': 'col', 'col2': 'col' };
    const service = new GoogleSpreadsheet('id', serviceAccountAuth);
    jest.spyOn(GoogleSpreadsheet.prototype, 'loadInfo').mockResolvedValue(true);
    jest
      .spyOn(GoogleSpreadsheet.prototype, 'sheetsByTitle', 'get')
      .mockImplementation(() => {
        return {'my-sheet-title': {addRow: mockAddRow}};
      });

    const subject = new DoorbellSpreadsheet(service, 'my-sheet-title', expectedRow);
    await subject.handle();
    expect(mockAddRow).toHaveBeenCalledWith(expectedRow);
  });
});
