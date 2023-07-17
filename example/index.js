const {
  GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_PRIVATE_KEY,
  SPREADSHEET_ID,
  SPREADSHEET_SHEET_TITLE,
  APEX_DOMAIN,
} = process.env;

const event = {};

(async function() {
  try {
    const {handler} = await import('../src/index.js');
    const result = await handler(event, {
      googleServiceAccountEmail: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      googlePrivateKey: GOOGLE_PRIVATE_KEY,
      spreadsheetId: SPREADSHEET_ID,
      spreadsheetSheetTitle: SPREADSHEET_SHEET_TITLE,
      apexDomain: APEX_DOMAIN,
    });
    console.log(result);
    return result;
  } catch(e) {
    console.log('debug',e);
  }
})();
