// sheets
const { GoogleSpreadsheet } = require("google-spreadsheet");

const getStore = async (p) => {
  const doc = new GoogleSpreadsheet(
    "10pHDAMIGl812Tufs-TXDQccYHYXsHSJrWdAfOYhmpuM"
  );

  doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
  });

  await doc.loadInfo();
};

module.exports = async () => {};
