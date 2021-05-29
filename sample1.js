const puppeteer = require('puppeteer');
const {IncomingWebhook} = require('@slack/webhook');

const testItem = async page => {
    console.log('############ get 1 Element ############')
    // CSS Selector
    const item = await page.$('body > aio-shell > aio-search-results > div > div:nth-child(2) > ul.priority-pages > li:nth-child(1)')
    console.log(await (await item.getProperty('innerHTML')).jsonValue())
    console.log('--------------------------------------')
    console.log(await (await item.getProperty('textContent')).jsonValue())
}
(async () => {
    const browser = await puppeteer.launch({
        headless: false,  // 動作確認するためheadlessモードにしない
        slowMo: 100,  // 動作確認しやすいようにpuppeteerの操作を遅延させる
        args: ['--lang=ja,en-US,en'], //デフォルトでは言語設定が英語なので日本語に変更
    })
    const page = await browser.newPage()
    await page.goto('https://www.google.com/')
    await page.type('input[name=q]', 'スカイツリー', {delay: 10})
    await page.click('input[type="submit"]')
    await page.waitForSelector('h3 a')
    await page.screenshot({path: 'screenshot/sample1.png'})

    // SPAサイトでも
    await page.goto('https://angular.io')
    console.log(await page.title())
    await page.type('input[aria-label=search]', 'cli') // 要素に文字列cliを入力
    await page.screenshot({path: 'screenshot/sample3.png'})
    const url = "https://hooks.slack.com/services/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";
    const webhook = new IncomingWebhook(url);
    testItem(page);
    await (async () => {
        await webhook.send({
            text: 'I\'ve got news for you...',
        });
    })();
    await browser.close()
})()