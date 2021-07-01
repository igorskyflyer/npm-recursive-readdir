const { readdirSync, statSync } = require('fs')
const { u } = require('@igor.dvlpr/upath')

const AllFolders = -1
const RootFolder = 0

/**
 * Callback for a predicate that allows filtering file-system entries.
 * @callback FilterCallback
 * @param {string} path
 * @param {boolean} isDirectory
 * @param {boolean} wasSkipped
 * @returns {boolean}
 */

/**
 * @enum {number}
 */
const RecursiveDirEntries = {
  All: -1,
  FilesOnly: 0,
  DirectoriesOnly: 1,
}

/**
 * Callback for a predicate that allows filtering file-system entries.
 * @typedef {Object} RecursiveDirOptions
 * @property {boolean} [prependRoot=true]
 * @property {FilterCallback} [filter]
 * @property {RecursiveDirEntries} [showEntries=RecursiveDirEntries.All]
 * @property {number} [maxDepth=All]
 */

/**
 * Default predicate for filtering.
 * Does nothing.
 * @private
 * @param {string} path
 * @returns {boolean}
 */
function defaultPredicate(path) {
  return true
}

/**
 *
 * @private
 * @param {boolean} isDirectory
 * @param {RecursiveDirEntries} entries
 */
function shouldPush(isDirectory, entries) {
  if (isDirectory && entries !== RecursiveDirEntries.FilesOnly) {
    return true
  } else if (!isDirectory && entries !== RecursiveDirEntries.DirectoriesOnly) {
    return true
  }

  return false
}

/**
 * @param {string} directory
 * @param {RecursiveDirOptions} options
 * @param {number} depth
 * @param {string[]} files
 * @returns {string[] | null}
 */
function recursiveDirSync(directory, options, depth, files) {
  if (!directory) {
    return []
  }

  if (depth == undefined) {
    depth = AllFolders
  }

  options = options || {}

  options.filter = options.filter || defaultPredicate
  options.maxDepth = options.maxDepth || AllFolders

  files = files || []

  try {
    const directoryEntries = readdirSync(directory)
    const directoryEntriesCount = directoryEntries.length

    if (directoryEntriesCount > 0) {
      depth++
    }

    if (typeof options.filter !== 'function') {
      options.filter = defaultPredicate
    }

    for (let i = 0; i < directoryEntriesCount; i++) {
      const fullPath = u(`${directory}/${directoryEntries[i]}`)
      let isDirectory = false
      let entry = ''

      if (options.maxDepth === RootFolder) {
        entry = directoryEntries[i]
      } else {
        entry = fullPath
      }

      try {
        isDirectory = statSync(fullPath).isDirectory()
      } catch {
        if (
          options.filter(entry, isDirectory, true) &&
          shouldPush(isDirectory, options.showEntries)
        ) {
          files.push(entry)
        }
        continue
      }

      if (options.maxDepth === AllFolders || depth < options.maxDepth) {
        try {
          if (
            options.filter(entry, isDirectory, false) &&
            shouldPush(isDirectory, options.showEntries)
          ) {
            files.push(entry)
          }

          if (isDirectory) {
            files = recursiveDirSync(fullPath, options, depth, files)
          }
        } catch {
          if (shouldPush(isDirectory, options.showEntries)) {
            options.filter(entry, isDirectory, true)
          }
        }
      } else {
        if (
          options.filter(entry, isDirectory, false) &&
          shouldPush(isDirectory, options.showEntries)
        ) {
          files.push(entry)
        }
      }
    }
  } catch {
    return null
  }

  return files
}

/**
 *
 * @param {string} directory
 * @param {FilterCallback} filter
 * @param {RecursiveDirOptions} options
 * @returns {Promise<string[]|null>}
 */
async function readDir(directory, options) {
  return new Promise((resolve, reject) => {
    resolve(recursiveDirSync(directory, options))
  })
}

/**
 * @param {string} directory
 * @param {RecursiveDirOptions} options
 * @returns {string[] | null}
 */
function readDirSync(directory, options) {
  return recursiveDirSync(directory, options)
}

/**
 * @private
 * @property {RecursiveDirOptions} options
 */
class RecursiveDir {
  constructor() {
    this.options = {
      prependRoot: true,
      maxDepth: AllFolders,
      filter: defaultPredicate,
      showEntries: RecursiveDirEntries.All,
    }
  }

  readDirSync(directory) {
    return recursiveDirSync(directory, this.options)
  }

  async readDir(directory, filter) {
    return new Promise((resolve, reject) => {
      resolve(recursiveDirSync(directory, this.options))
    })
  }

  /**
   *
   * @param {boolean} value
   * @returns {RecursiveDir}
   */
  setPrependRoot(value) {
    this.options.prependRoot = value
    return this
  }

  /**
   *
   * @param {RecursiveDirEntries} value
   * @returns {RecursiveDir}
   */
  setShowEntries(value) {
    this.options.showEntries = value
    return this
  }

  /**
   *
   * @param {number} value
   * @returns {RecursiveDir}
   */
  setMaxDepth(value) {
    this.options.maxDepth = value
    return this
  }

  /**
   *
   * @param {FilterCallback} value
   * @returns {RecursiveDir}
   */
  setFilter(value) {
    this.options.filter = value
    return this
  }
}

module.exports = {
  readDirSync,
  readDir,
  AllFolders,
  RootFolder,
  RecursiveDir,
}
