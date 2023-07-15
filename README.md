# @brthlmy/serverless-netlify-doorbell

Serverless netlify plugin to save own analytics in google sheets

## Prerequisite

* Netlify functions
* https://github.com/brthlmy-com/eleventy-plugin-doorbell
* Google Service Account + Google Spreadsheet

## Setup

In Netlfiy setup these environment variables:

* GOOGLE_SERVICE_ACCOUNT_EMAIL,
* GOOGLE_PRIVATE_KEY,
* SPREADSHEET_ID,
* SPREADSHEET_SHEET_TITLE,
* APEX_DOMAIN,

## Usage:

```javascript
# <repo>/functions/doorbell/index.js
exports.handler = async (event, context) => {
  const { handler } from "@brthlmy/serverless-netlify-doorbell"
  const result = await handler(event);
  return result;
};
```
