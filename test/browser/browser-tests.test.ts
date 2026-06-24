import path from 'node:path';

// @ts-expect-error: TS2307
import webdriver from 'selenium-webdriver';
import should from 'should';
import { afterAll, beforeAll, describe, it } from 'vitest';

import { BrowserList } from './browser-list.js';

for (const browser of BrowserList.allBrowsers) {
  let driver: any;

  describe(`Test in ${browser.name} browser`, function () {
    beforeAll(async function () {
      driver = await browser.create();
    }, 10000);

    afterAll(async function () {
      // Quit webdriver
      await driver.quit();
    }, 10000);

    it('Validate number of passed and failed tests', async function () {
      // Go to URL
      const htmlPath = path.join(__dirname, 'html', 'index.html');
      await driver.get(`file:///${htmlPath}`);

      const numPasses = await driver
        .findElement(webdriver.By.css('li.passes em'))
        .getText();
      should.equal(numPasses, 259);

      const numFails = await driver
        .findElement(webdriver.By.css('li.failures em'))
        .getText();
      should.equal(numFails, 0);
    }, 5000);
  });
}
