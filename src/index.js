"use strict";
const line = require("@line/bot-sdk");
const express = require("express");
const config = require("./const");
const handle = require("./main");
const { addMember, saveOpenProduct } = require("./db");
// create LINE SDK config from env variables

// create LINE SDK client
const client = new line.Client(config);
// create Express app
// about Express itself: https://expressjs.com/
const app = express();
app.get("/", (req, rep) => {
  rep.end("hello!!");
});
app.get("/product", async (req, rep) => {
  let { uid, pid } = req.query;
  await saveOpenProduct(uid, pid);
  rep.end(`這是商品頁`);
});

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post("/callback", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// exports.handler = async (req, res) =>
//   line.middleware(config)(req, res, () => {
//     console.log("req.body", JSON.stringify(req.body));
//     Promise.all(req.body.events.map(handleEvent))
//       .then((result) => {
//         console.log(result);
//         return res.json(result);
//       })
//       .catch((err) => {
//         console.error(err);
//         res.status(500).end();
//       });
//   });

// event handler
async function handleEvent(event) {
  // console.log(event);
  if (event.type === "follow") {
    let p = await client.getProfile(event.source.userId);
    // console.log(p);
    addMember(p);
  }

  if (event.type !== "message" || event.message.type !== "text") {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  // const echo = { type: "text", text: await handle(event.message.text) };
  const echo = await handle(event.message.text);
  // console.log(echo);

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}!`);
});
