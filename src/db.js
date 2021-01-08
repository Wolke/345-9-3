// sheets
const { GoogleSpreadsheet } = require("google-spreadsheet");

const getSheet = async (index = 0) => {
  const doc = new GoogleSpreadsheet(
    "10pHDAMIGl812Tufs-TXDQccYHYXsHSJrWdAfOYhmpuM"
  );

  doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
  });

  await doc.loadInfo(); // loads document properties and worksheets
  console.log(index);
  const sheet = doc.sheetsById[index]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  console.log(sheet.title);
  console.log(sheet.rowCount);
  return sheet;
};
exports.getMemberSheet = getSheet;
const addMember = async (p) => {
  let { userId, displayName, pictureUrl } = p;
  let sheet = await getSheet();
  // query

  await sheet.loadCells("A1:D1");
  let c = await sheet.getCell(0, 3);

  c.formula = `=MATCH("${userId}",A:A,0)`;
  await sheet.saveUpdatedCells();
  if (c.value > 0) {
  } else {
    await sheet.addRow({ userId, displayName, pictureUrl });
  }
};
const sendMessage = async () => {
  let sheet = await getSheet();
  await sheet.loadCells("A1:F1");
  const e1 = sheet.getCell(0, 4);
  const f1 = sheet.getCell(0, 5);
  e1.formula = `=OFFSET(A1,COUNTA(A:A)-1,0)`;
  await sheet.saveUpdatedCells();
  let v = e1.value;
  console.log(v);

  f1.formula = `=MATCH("${v}",A:A,0)`;
  await sheet.saveUpdatedCells();
  let c = f1.value;
  console.log(c);
  const line = require("@line/bot-sdk");
  const config = require("./const");
  const client = new line.Client(config);
  await sheet.loadCells(`A1:B${c}`);
  //send data

  for (let i = 1; i < c; i++) {
    let c = sheet.getCell(i, 0);
    let n = sheet.getCell(i, 1);
    console.log(i, c.value);
    await client.pushMessage(c.value, {
      type: "text",
      text: `${n.value}你好　這是個商品 https://4j8c4.sse.codesandbox.io/product?uid=${c.value}&pid=84526901`
    });
  }
  // client.pushMessage();
};
// sendMessage();
const saveOpenProduct = async (userId, pid) => {
  console.log("pid", pid);
  let sheet = await getSheet(pid);
  console.log(sheet.title);
  console.log(sheet.rowCount);
  // await sheet.addRow({ userId });
  console.log("done");
  await sheet.loadCells("A1:B1");
  const b1 = sheet.getCell(0, 1);
  b1.formula = `=MATCH("${userId}",A:A,0)`;
  await sheet.saveUpdatedCells();
  let v = b1.value;
  console.log(v, typeof v, typeof v === "object");
  if (typeof v === "object") {
    await sheet.addRow({ userId });
  }
};
// saveOpenProduct("", 84526901);
exports.saveOpenProduct = saveOpenProduct;
exports.addMember = addMember;
// getMemberSheet();
