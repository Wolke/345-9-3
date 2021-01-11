// sheets
const { GoogleSpreadsheet } = require("google-spreadsheet");

const getSheet = async (id = 0) => {
  const doc = new GoogleSpreadsheet(
    "10pHDAMIGl812Tufs-TXDQccYHYXsHSJrWdAfOYhmpuM"
  );

  doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
  });

  await doc.loadInfo(); // loads document properties and worksheets
  console.log(id);
  const sheet = doc.sheetsById[id]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  console.log(sheet.title);
  console.log(sheet.rowCount);
  return sheet;
};
exports.getMemberSheet = getSheet;
const addMember = async (p) => {
  let { userId, displayName, pictureUrl } = p;
  let sheet = await getSheet();
  await sheet.loadCells("A1:E1");
  let c = await sheet.getCell(0, 4);
  c.formula = `=MATCH("${userId}",A:A,0)`;
  await sheet.saveUpdatedCells();
  if (c.value > 0) {
  } else {
    sheet.addRow({ userId, displayName, pictureUrl });
  }
};
exports.addMember = addMember;

const saveOpenProduct = async (userId, pid) => {
  console.log(userId, pid);
  let sheet = await getSheet(pid);
  await sheet.loadCells("A1:B1");
  let b1 = sheet.getCell(0, 1);
  b1.formula = `=MATCH("${userId}",A:A,0)`;
  await sheet.saveUpdatedCells();
  console.log(b1.value);
  if (b1.value > 0) {
  } else {
    await sheet.addRow({ userId });
  }
};
exports.saveOpenProduct = saveOpenProduct;

const line = require("@line/bot-sdk");
const config = require("./const");
const client = new line.Client(config);

const sendMessage = async () => {
  let sheet = await getSheet();
  await sheet.loadCells("A1:F1");
  let e1 = sheet.getCell(0, 4);
  e1.formula = `=COUNTA(A:A)`;
  await sheet.saveUpdatedCells();
  await sheet.loadCells(`A1:B${e1.value}`);
  for (let i = 1; i < e1.value; i++) {
    let c_uid = sheet.getCell(i, 0);
    let c_name = sheet.getCell(i, 1);
    //send message
    client.pushMessage(c_uid.value, {
      type: "text",
      text: `${c_name.value} 這是商品 https://4j8c4.sse.codesandbox.io/product?uid=${c_uid.value}&pid=84526901`
    });
  }
};
// sendMessage();
