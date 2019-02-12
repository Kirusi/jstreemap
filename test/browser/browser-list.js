'use strict';

const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

class BrowserList {

    static async createChrome() {
        let options = new chrome.Options();
        options.addArguments([
            '--no-sandbox',
            '--disable-gpu',
            '--headless',
            '--remote-debugging-port=9392'
        ]);
        let driver = await new webdriver.Builder().
            withCapabilities(webdriver.Capabilities.chrome()).setChromeOptions(options).build();
        return driver;
    };

    static async createFirefox() {
        let driver = await new webdriver.Builder().
            withCapabilities(webdriver.Capabilities.firefox()).
            build();
        return driver;
    }

    static get allBrowsers() {
        return [
            {
                name: 'Chrome',
                create: BrowserList.createChrome
            },
            {
                name: 'Firefox',
                create: BrowserList.createFirefox
            }
        ];
    }
}

module.exports = BrowserList;