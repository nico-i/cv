/* eslint-disable no-console */
import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import fs from 'fs';

const MAX_RETRIES = 60; // Maximum number of retries
const RETRY_INTERVAL = 1000; // Retry every 1 second

async function waitForServer(url, retries = 0) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Server not ready`);
    }
    console.log(`Server is ready! 🚀`);
    return true;
  } catch {
    if (retries >= MAX_RETRIES) {
      console.error(`Server failed to start after maximum retries`);
      process.exit(1);
    }

    console.log(`Waiting for server... (${retries + 1}/${MAX_RETRIES})`);
    await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
    return waitForServer(url, retries + 1);
  }
}

async function printCVPdf() {
  const startTime = Date.now();
  const baseUrl = new URL(process.argv[2]);
  if (!baseUrl) {
    throw new Error(`No base URL provided`);
  }

  // Start the dev server
  const server = spawn(`npm`, [`run`, `dev:print`], {
    stdio: `inherit`,
    shell: true,
  });

  server.on(`error`, (error) => {
    console.error(`Failed to start dev server:`, error);
    process.exit(1);
  });

  server.on(`SIGINT`, () => {
    server.kill();
    process.exit();
  });

  try {
    await waitForServer(baseUrl);

    // start the browser with at least 1024x768
    const browser = await puppeteer.launch({
      headless: true,
    });

    const languages = [[`en`, `pdf`]];
    const themes = [`light`, `dark`];

    const dir = `docs/cv`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    for (const [language, path] of languages) {
      for (const theme of themes) {
        const page = await browser.newPage();

        await page.setViewport({
          width: 818,
          height: 768,
          deviceScaleFactor: 1,
        });

        await page.emulateMediaFeatures([
          {
            name: `prefers-color-scheme`,
            value: theme,
          },
        ]);

        // Navigate to the webpage you want to print
        const targetUrl = new URL(path, baseUrl);
        await page.goto(targetUrl.toString());

        const totalPage = await page.$(`body`);
        const boundingBox = await totalPage?.boundingBox();

        await page.pdf({
          path: `docs/cv/${language}-${theme}.pdf`,
          printBackground: true,
          height: `${boundingBox?.height}px`,
        });

        console.log(
          `Generated ${language}-${theme}.pdf from ${targetUrl} in ${Date.now() - startTime}ms`,
        );
      }
    }

    await browser.close();
    server.kill();
    process.exit();
  } catch (error) {
    console.error(`Error capturing screenshot:`, error);
    process.exit(1);
  } finally {
    // Kill the dev server
    server.kill();
  }
}

printCVPdf();
