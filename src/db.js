const { GoogleSpreadsheet } = require("google-spreadsheet");
const getSheet = async (id = 0) => {
  const doc = new GoogleSpreadsheet(
    "10pHDAMIGl812Tufs-TXDQccYHYXsHSJrWdAfOYhmpuM"
  );
  doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
  });
  await doc.loadInfo();
  console.log(doc.title);
  const sheet = doc.sheetsById[id];
  console.log(sheet.title);
  return sheet;
};
const addMember = async (p) => {
  let { userId, displayName, pictureUrl } = p;

  let sheet = await getSheet(0);
  await sheet.loadCells("A1:D1");
  let c = await sheet.getCell(0, 3);

  c.formula = `=MATCH("${userId}",A:A,0)`;
  await sheet.saveUpdatedCells();
  if (c.value > 0) {
  } else {
    await sheet.addRow({ userId, displayName, pictureUrl });
  }
};

exports.addMember = addMember;
