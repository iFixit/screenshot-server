const Koa = require("koa");
const _ = require("koa-route");
const cors = require("@koa/cors");
const fs = require("fs/promises");
const utils = require("./utils.js");
const glob = require("glob");
const app = new Koa();
const amqp = require("amqplib");
const rabbit = amqp.connect("amqp://localhost");
const routes = {
  start: async (ctx) => {
    const conn = await rabbit;
    const channel = await conn.createChannel();
    channel.assertQueue("jobs", {
      durable: false,
    });
    const url = utils.checkUrl(ctx.query.url);
    if (url === null) {
      ctx.status = 400;
      return;
    }
    channel.sendToQueue("jobs", Buffer.from(url.toString()));
    ctx.body = "Job queued";
  },
  status: async (ctx) => {
    const conn = await rabbit;
    const channel = await conn.createChannel();
    const info = await channel.assertQueue("jobs", {
      durable: false,
    });
    ctx.body = info;
  },
  screenshot: async (ctx) => {
    const deploy = await utils.deploy();
    const url = utils.checkUrl(ctx.query.url);
    if (url === null) {
      ctx.status = 400;
      return;
    }
    const key = utils.key(deploy, url);
    const filename_glob = utils.filename("*", key);
    const filenames = glob.sync(filename_glob);
    filenames.sort();
    if (filenames.length < 1) {
      ctx.status = 404;
      return;
    }
    const filename = filenames[0];
    ctx.body = await fs.readFile(filename);
    ctx.type = "image/png";
  },
};
app.use(cors());
app.use(_.get("/start", routes.start));
app.use(_.get("/screenshot", routes.screenshot));
app.use(_.get("/status", routes.status));

app.listen(3000, () => {
  console.log("Listening on 3000");
});
