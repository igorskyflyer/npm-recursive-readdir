const { readdirSync, statSync } = require('fs')
const { u } = require('@igor.dvlpr/upath')

const AllDirs = -1
const RootDir = 0

/**
 * Callback for a predicate that allows filtering file-system entries.
 * @callback FilterCallback
 * @param {string} path
 * @param {boolean} isDirectory
 * @param {boolean} wasSkipped
 * @returns {boolean}
 */

/** RecursiveDirEntries type used for showEntries property.
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
 * @property {FilterCallback} [filter]
 * @property {RecursiveDirEntries} [showEntries=RecursiveDirEntries.All]
 * @property {number} [maxDepth=All]
 */

/**
 * Default predicate for filtering.
 * Does nothing.
 * @private
 * @returns {boolean}
 */
function defaultPredicate() {
  return true
}

/**
 * Returns whether should we add the directory entry or not.
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
 * Synchronously returns a list of files/directories.
 * @private
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
    depth = AllDirs
  }

  options = options || {}

  options.filter = options.filter || defaultPredicate
  options.maxDepth = options.maxDepth || AllDirs

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

      if (options.maxDepth === RootDir) {
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

      if (options.maxDepth === AllDirs || depth < options.maxDepth) {
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
 * Asynchronously gets files/directories inside the given directory.
 * @param {string} directory the directory whose files/directories should be listed
 * @param {RecursiveDirOptions} options additional options
 * @returns {Promise<string[]|null>} returns Promise\<string[]\> or Promise\<null\>
 */
async function readDir(directory, options) {
  return new Promise((resolve, reject) => {
    try {
      resolve(recursiveDirSync(directory, options))
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Synchronously gets files/directories inside the given directory.
 * @param {string} directory the directory whose files/directories should be listed
 * @param {RecursiveDirOptions} options additional options
 * @returns {string[] | null} returns string[] or null if a fatal error has occurred
 */
function readDirSync(directory, options) {
  return recursiveDirSync(directory, options)
}

/**
 * RecursiveDir class
 */
class RecursiveDir {
  constructor() {
    this.options = {
      maxDepth: AllDirs,
      filter: defaultPredicate,
      showEntries: RecursiveDirEntries.All,
    }
  }

  /**
   * Synchronously gets files/directories inside the given directory.
   * @param {string} directory the directory whose files/directories should be listed
   * @returns {string[] | null} returns string[] or null if a fatal error has occurred
   */
  readDirSync(directory) {
    return recursiveDirSync(directory, this.options)
  }

  /**
   * Asynchronously gets files/directories inside the given directory.
   * @param {string} directory the directory whose files/directories should be listed
   * @returns {Promise<string[]|null>} returns Promise\<string[]\> or Promise\<null\>
   */
  async readDir(directory) {
    return new Promise((resolve, reject) => {
      try {
        resolve(recursiveDirSync(directory, this.options))
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   * Sets **showEntries** which controls whether to list files-only,
   * directories-only or both (default).
   * @param {RecursiveDirEntries} value
   * @returns {RecursiveDir}
   */
  setShowEntries(value) {
    this.options.showEntries = value
    return this
  }

  /**
   * Sets **maxDepth** which controls how many child directories'
   * entries are being listed.
   *
   * Provided const values are:
   * -  AllDirs = -1 (default) - return all subdirectories entries,
   * -  RootDir = 0 - return only root directory entries.
   * @param {number} value
   * @returns {RecursiveDir}
   */
  setMaxDepth(value) {
    if (value >= RootDir) {
      this.options.maxDepth = value
    }

    return this
  }

  /**
   * Sets **filter** predicate used for filtering
   * directory entries (directories/files)
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
  AllDirs,
  RootDir,
  RecursiveDir,
}
