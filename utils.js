const fetch = require("node-fetch");
const config = require("./config.js");

exports.key = (deploy, url) => {
  return Buffer.from(`${deploy.id}:${url}`)
    .toString("base64")
    .replace("/", "#");
};

exports.deploy = async (url) => {
  const parsed = new URL(url);
  parsed.pathname = config.deployEndpoint;
  parsed.search = "";
  const res = await fetch(parsed.toString());
  return await res.json();
};

exports.filename = (time, key) => {
  return `screenshots/${time}:${key}.png`;
};

exports.checkUrl = (url) => {
  try {
    const parsed = new URL(url);
    if (!config.isSafeUrl(parsed.hostname)) {
      return null;
    }
    return parsed;
  } catch (err) {
    console.error(err);
    return null;
  }
};
