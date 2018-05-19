#! /usr/bin/env node

const args = require('args')
const { join, isAbsolute } = require('path')
const { ensureDirSync } = require('fs-extra')
const browse = require('./browse')

args
  .option('keyword', 'The keyword for google image search', 'black cat')
  .option('dist', 'folder to store images', 'downloaded')

const { keyword, dist } = args.parse(process.argv)
const distFolder = isAbsolute(dist) ? dist : join(process.cwd(), dist)
ensureDirSync(dist)

browse(keyword, dist).then(() => {
  console.log('done!')
}).catch(e => {
  console.log(e)
})