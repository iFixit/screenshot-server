const utils = require("./utils.js");
const amqp = require("amqplib");
const rabbit = amqp.connect("amqp://localhost");
rabbit.then(async (conn) => {
  const { screenshot } = await import("./screenshot.mjs");
  const channel = await conn.createChannel();
  channel.assertQueue("jobs", {
    durable: false,
  });
  console.log("Connected");
  channel.prefetch(1);
  channel.consume(
    "jobs",
    async function (msg) {
      const url = msg.content.toString();
      const secs = Date.now();
      const deploy = await utils.deploy(url);
      const key = utils.key(deploy, url);
      const filename = utils.filename(secs, key);
      console.log(filename);
      await screenshot(url, filename);
      channel.ack(msg);
    },
    { noAck: false }
  );
});
