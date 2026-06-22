const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

class BrowserList {
  static async createChrome() {
    const options = new chrome.Options();
    options.addArguments([
      '--no-sandbox',
      '--disable-gpu',
      '--headless',
      '--remote-debugging-port=9392',
    ]);
    const driver = await new webdriver.Builder()
      .withCapabilities(webdriver.Capabilities.chrome())
      .setChromeOptions(options)
      .build();
    return driver;
  }

  static async createFirefox() {
    const driver = await new webdriver.Builder()
      .withCapabilities(webdriver.Capabilities.firefox())
      .build();
    return driver;
  }

  static get allBrowsers() {
    return [
      {
        name: 'Chrome',
        create: BrowserList.createChrome,
      },
      {
        name: 'Firefox',
        create: BrowserList.createFirefox,
      },
    ];
  }
}

module.exports = BrowserList;
