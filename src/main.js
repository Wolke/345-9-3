/*
flow
交通 => imagemenu
好物 => [...]
好店 => [...]
好宿 => [...]
...
*/
let getStore = require("./store");
async function handle(text) {
  // let r = text;
  switch (text) {
    case "好物":
    case "好店":
    case "好宿":
      // r = "好宿..";
      let stores = await getStore(text);
      return {
        type: "flex",
        altText: "this is a flex message",
        contents: {
          type: "carousel",
          contents: stores.map((s) => s.getResponse())
        }
      };
      break;
    case "交通":
      // r = "交通..";
      break;
    default:
      break;
  }
  return { type: "text", text };
}

module.exports = handle;
