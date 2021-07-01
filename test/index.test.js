/* eslint-disable no-undef */
const chai = require('chai').assert
const { readDirSync } = require('../index')
const testingPath = './test/testing'

describe('recursive-readdir tests', () => {
  describe('readDirSync()', () => {
    it('readDirSync() should return an empty array', () => {
      chai.isEmpty(readDirSync())
    })

    it('readDirSync("non-existent-folder") should return null', () => {
      chai.isNull(readDirSync('non-existent-folder'))
    })

    it('readDirSync("/testing", predicate<isDirectory>) should return 3', () => {
      const actual = readDirSync(testingPath, {
        filter: (path, isDirectory) => {
          return isDirectory
        },
      })

      console.log(actual)

      chai.equal(actual.length, 3)
    })

    it('readDirSync("/testing", predicate<filter>) should return 1', () => {
      const actual = readDirSync(testingPath, {
        filter: (path) => {
          return path.indexOf('.bin') > -1
        },
      })

      chai.equal(actual.length, 1)
    })

    it('readDirSync("/testing", predicate<wasSkipped>) should return 0', () => {
      const actual = readDirSync(testingPath, {
        filter: (path, isDirectory, wasSkipped) => {
          return wasSkipped
        },
      })

      chai.equal(actual.length, 0)
    })

    it('readDirSync("/testing", predicate<filter(.bin)>) should return sample.bin', () => {
      const actual = readDirSync(testingPath, {
        filter: (path) => {
          return path.indexOf('.bin') > -1
        },
      })

      chai.isAbove(actual[0].indexOf('sample.bin'), -1)
    })
  }) // readDirSync()
}) // recursive-readdir tests
