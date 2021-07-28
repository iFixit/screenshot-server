const fetch = require("node-fetch");
const config = require("./config.json");

exports.key = (deploy, url) => {
  return Buffer.from(`${deploy.id}:${url}`).toString("base64");
};

exports.deploy = async () => {
  const res = await fetch(config.deployUrl);
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
