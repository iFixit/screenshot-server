//const puppeteer = require("puppeteer");
import puppeteer from "puppeteer";

export async function screenshot(url, filename) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setDefaultTimeout(2 * 60 * 1000);
  await page.goto(url);
  const picture = await page.screenshot({ path: filename, fullPage: true });

  await browser.close();
  return picture;
}
