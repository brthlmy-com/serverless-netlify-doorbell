class DoorbellSpreadsheet {
  constructor(googleSpreadsheet, sheetTitle, sheetRow) {
    this.spreadsheetService = googleSpreadsheet;
    this.sheetTitle = sheetTitle;
    this.row = sheetRow;
  }

  handle = async () => {
    await this.spreadsheetService.loadInfo();
    const sheet = this.spreadsheetService.sheetsByTitle[this.sheetTitle];
    if(sheet) {
      await sheet?.addRow(this.row);
    }
  };
}

export {DoorbellSpreadsheet};
