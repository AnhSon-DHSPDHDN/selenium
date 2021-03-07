const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');
const setting = require('../setting.json');
const { Options } = require('selenium-webdriver/chrome');

const user = {
    username: 'admin',
    password: 'admin'
}

async function login(driver, username, password) {
    await driver.get(setting.webLink);
    await driver.wait(until.elementLocated(By.css('.btn-primary')), 10000);
    await driver.sleep(1000);
    const btnPrimary = await driver.findElements(By.css('.btn-primary'));
    await btnPrimary[0].click();
    await driver.wait(until.elementLocated(By.css('.box')), 10000);
    await driver.sleep(2000);
    await driver.findElement(By.css('input[name="username"]')).sendKeys(username);
    await driver.findElement(By.css('input[name="password"]')).sendKeys(password);
    await driver.sleep(500);
    await driver.findElement(By.css('button[type="summit"]')).click();
    await driver.wait(until.elementLocated(By.css('.icon-home')))
    await driver.sleep(1500);
    await expect(await driver.getCurrentUrl()).to.contains('http://localhost:3000')
}

describe('Xem thông tin gia sư, xem thông tin lớp học', async function () {
    this.timeout(0);
    let driver;

    before(async () => {
        const chromeOpts = [
            '--disable-dev-shm-usage'
        ];
        driver = new Builder().setChromeOptions(new Options().addArguments(chromeOpts)).forBrowser('chrome').build()
        await login(driver, user.username, user.password);
    })
    it('Xem thông tin lớp học', async () => {
        let itemClass = await driver.findElements(By.css('.item'));
        await itemClass[3].click();
        await driver.wait(until.elementLocated(By.css('.detail')), 10000);
        await driver.sleep(1000)
        await expect(await driver.getCurrentUrl()).to.contains('detail')
    })
    it('Xem thông tin gia sư', async () => {
        await driver.sleep(1000);
        await driver.findElement(By.css('a[href="/seachteacher"]')).click();
        await driver.wait(until.elementLocated(By.tagName('h4')), 10000);
        await driver.sleep(1000);
        let listTagA = await driver.findElements(By.tagName('a'));
        await listTagA[13].click();
        await driver.wait(until.elementLocated(By.css('.detail')), 10000);
        await driver.sleep(1000)
        await expect(await driver.getCurrentUrl()).to.contains('teacher');
    });
    after(async () => {
        await driver.close()
    })
})