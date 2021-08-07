import { readdirSync } from 'fs'
import { u } from '@igor.dvlpr/upath'

/** Used for maxDepth parameter
 * @readonly
 * @enum {number}
 */
export const Depth = {
  /** All subdirectories */
  All: -1,
  /** Only the root directory */
  Root: 0,
}

/** Used for entries filtering parameter
 * @readonly
 * @enum {number}
 */
export const Entry = {
  /** All directory entries - files and subdirectories */
  All: 0xaaa,
  /** Only files */
  FilesOnly: 0xbbb,
  /** Only subdirectories */
  DirectoriesOnly: 0xccc,
}

/**
 * @typedef {Object} RecursiveFilterParams
 * @property {string} path Path of directory entry.
 * @property {boolean} isDirectory Indicates whether the entry is a directory.
 * @property {boolean} wasSkipped Indicates if the entry was skipped during traversal, most frequently caused by lack of permissions.
 */

/**
 * Callback for a predicate that allows filtering file-system entries.
 * @callback FilterCallback
 * @param {RecursiveFilterParams} entry A `RecursiveFilterParams` object that contains information about the given entry.
 * @returns {boolean}
 */

/**
 * Callback for a predicate that allows filtering file-system entries.
 * @typedef {Object} RecursiveDirOptions
 * @property {FilterCallback} [filter] A function used for filtering when traversing the provided directory.
 * @property {Entry} [entries=Entry.All] Indicates which entries to show, files-only, directories-only or all (**default**), use any of the following values,
 *
 * - `Entry.FilesOnly`,
 * - `Entry.DirectoriesOnly`,
 * - `Entry.All` (**default**),
 * @property {Depth} [maxDepth=Depth.Root] The level of child directories to read, possible values:
 *
 * - `Depth.All`
 * - `Depth.Root` (**default**)
 * - any arbitrary value that conforms the condition `maxDepth >= 0`,
 * @property {boolean} [addTrailingSlash=false] Indicates whether a trailing slash should be added to directory paths.
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
 * Returns whether we should add the directory entry or not.
 * @private
 * @param {boolean} isDirectory
 * @param {number} entries
 */
function shouldPush(isDirectory, entries) {
  if (isDirectory && entries !== Entry.FilesOnly) {
    return true
  } else if (!isDirectory && entries !== Entry.DirectoriesOnly) {
    return true
  }

  return false
}

/**
 * Creates a RecursiveFilterParams object.
 * @private
 * @param {String} path
 * @param {boolean} isDirectory
 * @param {boolean} wasSkipped
 */
function createRecursiveFilterParams(path, isDirectory, wasSkipped) {
  return { path, isDirectory, wasSkipped }
}

/**
 * Synchronously returns a list of files/directories.
 * @private
 * @param {string} directory
 * @param {RecursiveDirOptions} options
 * @param {number} [depth]
 * @param {string[]} [files]
 * @returns {string[]}
 */
function recursiveDirSync(directory, options, depth, files) {
  if (!directory) {
    return []
  }

  if (depth == undefined) {
    depth = Depth.Root
  }

  options = options || {}

  options.filter = options.filter || defaultPredicate

  if (typeof options.maxDepth !== 'number' || options.maxDepth < Depth.All) {
    options.maxDepth = Depth.Root
  }

  files = files || []

  try {
    const directoryEntries = readdirSync(directory, { withFileTypes: true })
    const directoryEntriesCount = directoryEntries.length

    if (directoryEntriesCount > 0) {
      depth++
    }

    if (typeof options.filter !== 'function') {
      options.filter = defaultPredicate
    }

    for (let i = 0; i < directoryEntriesCount; i++) {
      const entry = directoryEntries[i]
      const fullPath = u(`${directory}/${entry.name}`)
      let isDirectory = false
      let path = ''

      if (options.maxDepth === Depth.Root) {
        path = entry.name
      } else {
        path = fullPath
      }

      try {
        isDirectory = entry.isDirectory()

        if (options.addTrailingSlash && isDirectory) {
          path = u(path, true)
        }
      } catch {
        // @ts-ignore
        if (options.filter(createRecursiveFilterParams(path, isDirectory, true)) && shouldPush(isDirectory, options.entries)) {
          files.push(path)
        }
        continue
      }

      if (options.maxDepth === Depth.All || depth < options.maxDepth) {
        try {
          // @ts-ignore
          if (options.filter(createRecursiveFilterParams(path, isDirectory, false)) && shouldPush(isDirectory, options.entries)) {
            files.push(path)
          }

          if (isDirectory) {
            files = recursiveDirSync(fullPath, options, depth, files)
          }
        } catch {
          // @ts-ignore
          if (shouldPush(isDirectory, options.entries)) {
            options.filter(createRecursiveFilterParams(path, isDirectory, true))
          }
        }
      } else {
        // @ts-ignore
        if (options.filter(createRecursiveFilterParams(path, isDirectory, false)) && shouldPush(isDirectory, options.entries)) {
          files.push(path)
        }
      }
    }
  } catch {
    return []
  }

  return files
}

/**
 * Asynchronously gets files/directories inside the given directory.
 * @param {string} directory the directory whose files/directories should be listed
 * @param {RecursiveDirOptions} [options] additional options
 * @returns {Promise<string[]>} returns Promise\<string[]\>
 */
export async function readDir(directory, options) {
  return new Promise((resolve, reject) => {
    try {
      // @ts-ignore
      resolve(recursiveDirSync(directory, options))
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Synchronously gets files/directories inside the given directory.
 * @param {string} directory the directory whose files/directories should be listed
 * @param {RecursiveDirOptions} [options] additional options
 * @returns {string[]} returns string[]
 */
export function readDirSync(directory, options) {
  // @ts-ignore
  return recursiveDirSync(directory, options)
}

/**
 * RecursiveDir class
 * @class
 */
export class RecursiveDir {
  constructor() {
    /**
     * @type {RecursiveDirOptions}
     */
    this.options = {
      maxDepth: Depth.Root,
      filter: defaultPredicate,
      entries: Entry.All,
      addTrailingSlash: false,
    }
  }

  /**
   * Synchronously gets files/directories inside the given directory.
   * @param {string} directory the directory whose files/directories should be listed
   * @returns {string[]} returns string[]
   */
  readDirSync(directory) {
    return recursiveDirSync(directory, this.options)
  }

  /**
   * Asynchronously gets files/directories inside the given directory.
   * @param {string} directory the directory whose files/directories should be listed
   * @returns {Promise<string[]>} returns Promise\<string[]\>
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
   * Sets the **entries** property which controls which entries to show, files-only, directories-only or all (**default**), use any of the following values,
   *
   * - `Entry.FilesOnly`,
   * - `Entry.DirectoriesOnly`,
   * - `Entry.All` (**default**),
   * @param {Entry} value
   * @returns {RecursiveDir}
   */
  entries(value) {
    this.options.entries = value
    return this
  }

  /**
   * Sets **maxDepth** which controls how many child directories'
   * entries are being listed.
   *
   * Possible values:
   *
   * - `Depth.All`
   * - `Depth.Root` (**default**)
   * - any arbitrary value that conforms the condition `maxDepth >= 0`.
   * @param {Depth} value
   * @returns {RecursiveDir}
   */
  maxDepth(value) {
    if (value >= Depth.All) {
      this.options.maxDepth = value
    }

    return this
  }

  /**
   * Sets **filter** predicate function used for filtering
   * directory entries (directories/files)
   * @param {FilterCallback} value
   * @returns {RecursiveDir}
   */
  filter(value) {
    this.options.filter = value
    return this
  }

  /**
   * Sets whether a trailing slash should be added to directory entries.
   * @param {boolean} value
   * @returns {RecursiveDir}
   */
  addTrailingSlash(value) {
    this.options.addTrailingSlash = value
    return this
  }
}
