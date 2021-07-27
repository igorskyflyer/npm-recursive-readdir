const chai = require('chai').assert
const { readDirSync, Depth } = require('../recursive-readdir')
const testingPath = './test/testing'

describe('recursive-readdir tests', () => {
  describe('readDirSync()', () => {
    it('readDirSync() should return an empty array', () => {
      // @ts-ignore
      chai.isEmpty(readDirSync())
    })

    it('readDirSync("non-existent-directory") should return []', () => {
      chai.isEmpty(readDirSync('non-existent-directory'))
    })

    it('readDirSync("/testing", predicate<isDirectory>) should return 3', () => {
      const actual = readDirSync(testingPath, {
        maxDepth: Depth.All,
        filter: (entry) => entry.isDirectory,
      })

      chai.equal(actual.length, 3)
    })

    it('readDirSync("/testing", predicate<filter>) should return 1', () => {
      const actual = readDirSync(testingPath, {
        maxDepth: Depth.All,
        filter: (entry) => entry.path.indexOf('.bin') > -1,
      })

      chai.equal(actual.length, 1)
    })

    it('readDirSync("/testing", predicate<wasSkipped>) should return 0', () => {
      const actual = readDirSync(testingPath, {
        filter: (entry) => entry.wasSkipped,
      })

      chai.equal(actual.length, 0)
    })

    it('readDirSync("/testing", predicate<filter(.bin)>) should return sample.bin', () => {
      const actual = readDirSync(testingPath, {
        maxDepth: Depth.All,
        filter: (entry) => entry.path.indexOf('.bin') > -1,
      })

      chai.isAbove(actual[0].indexOf('sample.bin'), -1)
    })
  }) // readDirSync()
}) // recursive-readdir tests
