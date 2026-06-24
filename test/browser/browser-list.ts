// @ts-expect-error: TS2307
import webdriver from 'selenium-webdriver';
// @ts-expect-error: TS2307
import chrome from 'selenium-webdriver/chrome';
// @ts-expect-error: TS2307
import firefox from 'selenium-webdriver/firefox';

export class BrowserList {
  static async createChrome(): Promise<any> {
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

  static async createFirefox(): Promise<any> {
    const options = new firefox.Options().addArguments('-headless');
    const driver = await new webdriver.Builder()
      .withCapabilities(webdriver.Capabilities.firefox())
      .setFirefoxOptions(options)
      .build();
    return driver;
  }

  static get allBrowsers(): any {
    if (process.env.GITHUB_ACTIONS) {
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
    } else {
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
}
