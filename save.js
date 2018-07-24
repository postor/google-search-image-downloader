const { join } = require('path')
const isDataUri = require('is-data-uri');
const md5 = require('md5');
const base64Img = require('base64-img');
const { writeFile } = require('fs-extra')

module.exports.dealqueue = dealqueue

module.exports.download = async (url, distFolder) => {
  if (!url) {
    console.log(`invalid url`, { url, })
    return
  }
  const fileName = md5(url)

  if (!isDataUri(url)) {
    await download2(url, distFolder, fileName)
  } else if(!url.startsWith('http')){
    console.log(`invalid url`, { url, })
    return 
  } else {
    await save(url, distFolder, fileName)
  }
}

function save(url, distFolder, fileName) {
  return new Promise((resolve, reject) => {
    base64Img.img(url, distFolder, fileName, function (err, filepath) {
      if (err) {
        resolve(false)
        return
      }
      resolve(true)
    });
  })
}

let queue = []

async function download2(url, distFolder, fileName) {
  queue.push({ url, distFolder, fileName })
}

async function dealqueue(browser) {
  const page = await browser.newPage()
  for (let i = 0; i < queue.length; i++) {
    const { url, distFolder, fileName } = queue[i]
    //console.log({ queueIndex: i })
    try {
      const viewSource = await page.goto(url);
      await writeFile(join(distFolder, `${fileName}.png`), await viewSource.buffer())
    } catch (e) {
      console.log({ e, url })
    }
  }
  page.close()
}