#! /usr/bin/env node

const argv = require('yargs').argv
const { join, isAbsolute } = require('path')
const { ensureDirSync } = require('fs-extra')
const browse = require('./browse')


const { keyword = 'cat', dist = 'downloads' } = argv
const distFolder = isAbsolute(dist) ? dist : join(process.cwd(), dist)
ensureDirSync(distFolder)

browse(keyword, distFolder).then(() => {
  console.log('done!')
}).catch(e => {
  console.log(e)
})