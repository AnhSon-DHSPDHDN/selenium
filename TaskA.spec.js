const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');
const setting = require('../setting.json');
const { Options } = require('selenium-webdriver/chrome');

function randomUser(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const userRegister = {
    username: randomUser(10),
    password: randomUser(10)
}

describe('Login, Logout, Đăng ký tài khoản', async function () {
    this.timeout(0);
    let driver;

    before(async () => {
        const chromeOpts = [
            '--disable-dev-shm-usage'
        ];
        driver = new Builder().setChromeOptions(new Options().addArguments(chromeOpts)).forBrowser('chrome').build()
    })
    it('Đăng nhập - Username hoặc password bỏ trống', async () => {
        await driver.get(setting.webLink);
        await driver.wait(until.elementLocated(By.css('.btn-primary')), 10000);
        await driver.sleep(1000);
        const btnPrimary = await driver.findElements(By.css('.btn-primary'));
        await btnPrimary[0].click();
        await driver.wait(until.elementLocated(By.css('.box')), 10000);
        await driver.sleep(2000);
        await driver.findElement(By.css('button[type="summit"]')).click();
        await driver.wait(until.alertIsPresent());
        await driver.sleep(2000)
        let alert = await driver.switchTo().alert();
        await expect(await alert.getText()).to.contains('Incorrect username or password');
        await alert.accept();
        await driver.switchTo().defaultContent();
        await driver.sleep(1000);
        await driver.findElement(By.css('input[name="username"]')).sendKeys('admin');
        await driver.sleep(500);
        await driver.findElement(By.css('button[type="summit"]')).click();
        await driver.wait(until.alertIsPresent());
        await driver.sleep(2000)
        alert = await driver.switchTo().alert();
        await expect(await alert.getText()).to.contains('Incorrect username or password');
        await alert.accept();
        await driver.switchTo().defaultContent();
        await driver.sleep(1000);
        await driver.findElement(By.css('input[name="username"]')).sendKeys(Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE, Key.BACK_SPACE);
        await driver.findElement(By.css('input[name="password"]')).sendKeys('admin');
        await driver.sleep(500);
        await driver.findElement(By.css('button[type="summit"]')).click();
        await driver.wait(until.alertIsPresent());
        await driver.sleep(2000)
        alert = await driver.switchTo().alert();
        await expect(await alert.getText()).to.contains('Incorrect username or password');
        await alert.accept();
        await driver.switchTo().defaultContent();
        await driver.sleep(1000);
        await driver.findElement(By.css('input[name="password"]')).clear();
        await driver.sleep(500);
    })
    it('Đăng nhập - Username, password Sai', async () => {
        await driver.findElement(By.css('input[name="username"]')).sendKeys('adminsaiusername');
        await driver.findElement(By.css('input[name="password"]')).sendKeys('adminsaipassword');
        await driver.sleep(500);
        await driver.findElement(By.css('button[type="summit"]')).click();
        await driver.wait(until.alertIsPresent());
        await driver.sleep(2000)
        alert = await driver.switchTo().alert();
        await expect(await alert.getText()).to.contains('Incorrect username or password');
        await alert.accept();
        await driver.switchTo().defaultContent();
        await driver.sleep(1000);
    })
    it('Đăng nhập thành công', async () => {
        await driver.findElement(By.css('input[name="username"]')).clear();
        await driver.findElement(By.css('input[name="password"]')).clear();
        await driver.findElement(By.css('input[name="username"]')).sendKeys('admin');
        await driver.findElement(By.css('input[name="password"]')).sendKeys('admin');
        await driver.sleep(500);
        await driver.findElement(By.css('button[type="summit"]')).click();
        await driver.wait(until.elementLocated(By.css('.icon-home')))
        await driver.sleep(1500);
        await expect(await driver.getCurrentUrl()).to.contains('http://localhost:3000')
    })
    it('Đăng xuất', async () => {
        await driver.findElement(By.css('.btn-success')).click();
        await driver.wait(until.elementLocated(By.css('.box')), 10000);
        await driver.sleep(2000);
        await expect(await driver.getCurrentUrl()).to.contains('http://localhost:3000/login')
    })
    it('Đăng ký tài khoản', async () => {
        await driver.findElement(By.css('a[href="/register"]')).click();
        await driver.sleep(500);
        await driver.wait(until.elementLocated(By.css('.box')), 10000);
        await driver.sleep(1000);
        // Thông tin bỏ trống
        let buttons = await driver.findElements(By.css('button[type="button"]'))
        await buttons[2].click();
        await driver.wait(until.alertIsPresent());
        await driver.sleep(2000)
        alert = await driver.switchTo().alert();
        await expect(await alert.getText()).to.contains('incorrect password');
        await alert.accept();
        await driver.switchTo().defaultContent();
        await driver.sleep(1000);

        // Trùng tài khoản sử dụng
        await driver.findElement(By.css('input[name="username"]')).sendKeys('admin');
        await driver.findElement(By.css('input[name="password"]')).sendKeys('admin');
        await driver.findElement(By.css('input[name="repassword"]')).sendKeys('admin');
        await driver.sleep(500);
        await buttons[2].click();
        await driver.wait(until.alertIsPresent());
        await driver.sleep(2000)
        alert = await driver.switchTo().alert();
        await expect(await alert.getText()).to.contains('usersname is uses');
        await alert.accept();
        await driver.switchTo().defaultContent();
        await driver.sleep(1000);

        // Sai nhập lại password
        await driver.findElement(By.css('input[name="username"]')).clear();
        await driver.findElement(By.css('input[name="password"]')).clear();
        await driver.findElement(By.css('input[name="repassword"]')).clear();
        await driver.findElement(By.css('input[name="username"]')).sendKeys(userRegister.username);
        await driver.findElement(By.css('input[name="password"]')).sendKeys(userRegister.password);
        await driver.findElement(By.css('input[name="repassword"]')).sendKeys('admin');
        await driver.sleep(500);
        await buttons[2].click();
        await driver.wait(until.alertIsPresent());
        await driver.sleep(2000)
        alert = await driver.switchTo().alert();
        await expect(await alert.getText()).to.contains('incorrect password');
        await alert.accept();
        await driver.switchTo().defaultContent();
        await driver.sleep(1000);

        // Đăng ký thành công
        await driver.findElement(By.css('input[name="username"]')).clear();
        await driver.findElement(By.css('input[name="password"]')).clear();
        await driver.findElement(By.css('input[name="repassword"]')).clear();
        await driver.findElement(By.css('input[name="username"]')).sendKeys(userRegister.username);
        await driver.findElement(By.css('input[name="password"]')).sendKeys(userRegister.password);
        await driver.findElement(By.css('input[name="repassword"]')).sendKeys(userRegister.password);
        await driver.sleep(500);
        await buttons[2].click();
        await driver.wait(until.alertIsPresent());
        await driver.sleep(2000)
        alert = await driver.switchTo().alert();
        await expect(await alert.getText()).to.contains('Account registration successful');
        await alert.accept();
        await driver.switchTo().defaultContent();
        await driver.sleep(1000);
        await driver.wait(until.elementLocated(By.css('.box')), 10000);
        await driver.sleep(1000);

        // Thử tài khoản vừa đăng ký
        await driver.findElement(By.css('input[name="username"]')).sendKeys(userRegister.username);
        await driver.findElement(By.css('input[name="password"]')).sendKeys(userRegister.password);
        await driver.sleep(500);
        await driver.findElement(By.css('button[type="summit"]')).click();
        await driver.wait(until.elementLocated(By.css('.icon-home')))
        await driver.sleep(1500);
        await expect(await driver.getCurrentUrl()).to.contains('http://localhost:3000')
    })
    after(async () => {
        await driver.close()
    })
})