'use strict'

const cacache = require('cacache')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
const path = require('path')
const tap = require('tap')

const cacheDir = path.resolve(__dirname, '../cache')

module.exports = testDir
function testDir (filename) {
  const base = path.basename(filename, '.js')
  const dir = path.join(cacheDir, base)
  tap.beforeEach(function () {
    return reset(dir)
  })
  if (!process.env.KEEPCACHE) {
    tap.tearDown(function () {
      process.chdir(__dirname)
      try {
        rimraf.sync(dir)
      } catch (e) {
        if (process.platform !== 'win32')
          throw e
      }
    })
  }
  return dir
}

module.exports.reset = reset
function reset (testDir) {
  cacache.clearMemoized()
  process.chdir(__dirname)
  return new Promise((resolve, reject) => {
    rimraf(testDir, function (err) {
      if (err)
        return reject(err)
      mkdirp(testDir).then(() => {
        process.chdir(testDir)
        resolve()
      }, reject)
    })
  })
}
