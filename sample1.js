const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,  // 動作確認するためheadlessモードにしない
    slowMo: 500,  // 動作確認しやすいようにpuppeteerの操作を遅延させる
    args: ['--lang=ja,en-US,en'], //デフォルトでは言語設定が英語なので日本語に変更
  })
  const page = await browser.newPage()
  await page.goto('https://www.google.com/')
  await page.type('input[name=q]', 'スカイツリー', { delay: 10 })
  await page.click('input[type="submit"]')
  await page.waitForSelector('h3 a')
  await page.screenshot({ path: 'screenshot/sample1.png' })

  await page.goto('https://developer.chrome.com/home/platform-pillar')
  // ページタイトル取得
  console.log(await page.title())

  // SPAサイトでも
  await page.goto('https://angular.io')
  console.log(await page.title())
  await page.type('input[aria-label=search]', 'cli') // 要素に文字列cliを入力
  await page.screenshot({path: 'sample3.png'})

  await browser.close()
})()