'use strict';

const BrowserList = require('./browser-list');

const webdriver = require('selenium-webdriver');
const should = require('should');
const path = require('path');

for (let browser of BrowserList.allBrowsers) {

    let driver;

    describe(`Test in ${browser.name} browser`, function() {
        before(async function() {
        // eslint-disable-next-line no-invalid-this
            this.timeout(10000);
            driver = await browser.create();
        });

        after(async function() {
        // eslint-disable-next-line no-invalid-this
            this.timeout(10000);
            // Quit webdriver
            await driver.quit();
        });

        it('Validate number of passed and failed tests', async function() {
        // eslint-disable-next-line no-invalid-this
            this.timeout(5000);
            // Go to URL
            let htmlPath = path.join(__dirname, 'html', 'index.html');
            await driver.get(`file:///${htmlPath}`);

            let numPasses = await driver.findElement(webdriver.By.css('li.passes em')).getText();
            should.equal(141, numPasses);

            let numFails = await driver.findElement(webdriver.By.css('li.failures em')).getText();
            should.equal(0, numFails);
        });
    });
}