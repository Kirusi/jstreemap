const path = require('node:path');

const webdriver = require('selenium-webdriver');
const should = require('should');

const BrowserList = require('./browser-list');

for (const browser of BrowserList.allBrowsers) {
  let driver;

  describe(`Test in ${browser.name} browser`, function () {
    before(async function () {
      this.timeout(10000);
      driver = await browser.create();
    });

    after(async function () {
      this.timeout(10000);
      // Quit webdriver
      await driver.quit();
    });

    it('Validate number of passed and failed tests', async function () {
      this.timeout(5000);
      // Go to URL
      const htmlPath = path.join(__dirname, 'html', 'index.html');
      await driver.get(`file:///${htmlPath}`);

      const numPasses = await driver
        .findElement(webdriver.By.css('li.passes em'))
        .getText();
      should.equal(numPasses, 141);

      const numFails = await driver
        .findElement(webdriver.By.css('li.failures em'))
        .getText();
      should.equal(numFails, 0);
    });
  });
}
