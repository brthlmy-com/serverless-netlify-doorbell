import {DoorbellAnalytics} from '../src/index.js';

const example = async () => {
  try {
    const doorbell = new DoorbellAnalytics({
      processEnv: {
        GOOGLE_SERVICE_ACCOUNT_EMAIL: 'x',
        GOOGLE_PRIVATE_KEY: 'x',
        SPREADSHEET_ID: 'x',
        SPREADSHEET_SHEET_TITLE: 'x',
        APEX_DOMAIN: 'x',
      },
    });

    const event = {headers: {host: 'x'}};
    const context = {};
    await doorbell.handle(event, context);
  } catch (e) {
    console.error(e);
  }
};

example();
