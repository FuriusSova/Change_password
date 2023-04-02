const fs = require("fs")
const puppeteer = require("puppeteer")
const generator = require("generate-password")
const opts = require("./options")
const data = fs.readFileSync('./acc_data/accaunts.txt', "utf8").split('\n')
const arrOfAccs = data.map((acc) => {
    return acc.replace('\r', '').split(";")
})

const changePassword = async (browser, email, password, newPassword) => {
    try {
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);
        await page.goto('https://firstmail.ltd/webmail/login');

        await page.type("#email", email);
        await page.type("#password", password);

        await page.click("#formAuthentication > div.col-12.mt-1 > button");

        await page.waitForSelector("#__layout > div > div.layout-wrapper.layout-navbar-full.layout-horizontal.layout-without-menu.mb-0 > div > div > div.card.mb-3 > div.card-img-top.w-100");

        await page.goto("https://firstmail.ltd/webmail/settings");

        await page.waitForSelector("#__layout > div > div.layout-wrapper.layout-navbar-full.layout-horizontal.layout-without-menu.mb-0 > div > div > div.card.mb-3 > div.card-img-top.w-100");

        await page.type("#formAccountSettings > div:nth-child(1) > div > div.input-group.input-group-merge.has-validation > input", password);
        await page.type("#formAccountSettings > div:nth-child(2) > div:nth-child(1) > div.input-group.input-group-merge.has-validation > input", newPassword);
        await page.type("#confirmPassword", newPassword);

        await page.click("#formAccountSettings > div:nth-child(2) > div.col-12.mt-1 > button")

        await page.waitForSelector('div.toasted-container.bottom-right > div')

        await page.close()
        return 'done'
    } catch (error) {
        return error
    }
}

const openBrowser = async () => {
    const browser = await puppeteer.launch(opts.LAUNCH_PUPPETEER_OPTS);
    for (acc of arrOfAccs) {
        try {
            let newPassword = generator.generate({
                length: 10,
                numbers: true
            });
            const res = await changePassword(browser, acc[0], acc[2], newPassword)
            if(res == 'done'){
                fs.appendFileSync('./acc_data/newAccaunts.txt', `${arrOfAccs[arrOfAccs.indexOf(acc)][0]};${arrOfAccs[arrOfAccs.indexOf(acc)][1]};${newPassword}\r\n`)
                console.log(`${acc[0]} done with password: ${newPassword}`)
            } else {
                console.log(res, acc[0])
            }
        } catch (error) {
            console.log(error, acc[0])
        }
    }
    await browser.close()
}

openBrowser()