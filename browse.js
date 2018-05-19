const { URL } = require('url')
const puppeteer = require('puppeteer');
const { download, dealqueue } = require('./save')

module.exports = async (keyword, distFolder) => {
  const browser = await puppeteer.launch({args: ['--no-sandbox']})
  const page = await browser.newPage();
  await page.goto(getUrl(keyword));
  while (true) {
    const isBottom = await page.evaluate(() => {
      return (window.innerHeight + window.scrollY) >= document.body.offsetHeight
    })
    if (isBottom) {
      let showMore = true
      try {
        const showMoreBtn = await page.$('#smb')
        await showMoreBtn.click()
        console.log('show more button!')
      } catch (e) {
        showMore = false
      }
      if (!showMore) {
        //console.log({ isBottom, showMore })
        break;
      }
    }
    await page.evaluate(() => {
      window.scrollTo(0, window.scrollY + window.innerHeight);
    })
    console.log('next page!')
    if (isBottom) {
      await delay(1000)
    } else {
      await delay(500)
    }
  }
  console.log('download start!')
  const imgs = await page.$$('img')
  await Promise.all(imgs.map(async (img) => {
    const srcRef = await img.getProperty('src')
    let src
    for (let i = 0; i < 5; i++) {
      src = await srcRef.jsonValue()
      if (src) {
        break;
      }
      //console.log({ wait: 'src' })
      await delay(1000)
    }
    await download(src, distFolder)
  }))
  //console.log('dealqueue')
  await dealqueue(browser)

  await browser.close();
}



function getUrl(keyword) {
  const url = new URL('https://www.google.com.hk/search?tbm=isch')
  url.searchParams.append('q', keyword)
  return url.href
}

function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}