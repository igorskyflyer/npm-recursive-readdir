import { assert, describe, it } from 'vitest'
import { Depth, type RecursiveFilterParams, readDirSync } from '../src/index.js'

const testingPath = './test/testing'

describe('recursive-readdir tests', () => {
  describe('readDirSync()', () => {
    it('readDirSync() should return an empty array', () => {
      // @ts-expect-error
      assert.isEmpty(readDirSync())
    })

    it('readDirSync("non-existent-directory") should return []', () => {
      assert.isEmpty(readDirSync('non-existent-directory', {}))
    })

    it('readDirSync("/testing", predicate<isDirectory>) should return 3', () => {
      const actual = readDirSync(testingPath, {
        maxDepth: Depth.All,
        filter: (entry: RecursiveFilterParams) => entry.isDirectory
      })

      assert.equal(actual.length, 3)
    })

    it('readDirSync("/testing", predicate<filter>) should return 1', () => {
      const actual = readDirSync(testingPath, {
        maxDepth: Depth.All,
        filter: (entry: RecursiveFilterParams) =>
          entry.path.indexOf('.bin') > -1
      })

      assert.equal(actual.length, 1)
    })

    it('readDirSync("/testing", predicate<wasSkipped>) should return 0', () => {
      const actual = readDirSync(testingPath, {
        filter: (entry: RecursiveFilterParams) => entry.wasSkipped
      })

      assert.equal(actual.length, 0)
    })

    it('readDirSync("/testing", predicate<filter(.bin)>) should return sample.bin', () => {
      const actual = readDirSync(testingPath, {
        maxDepth: Depth.All,
        filter: (entry: RecursiveFilterParams) =>
          entry.path.indexOf('.bin') > -1
      })

      assert.isAbove(actual[0].indexOf('sample.bin'), -1)
    })
  }) // readDirSync()
}) // recursive-readdir tests
