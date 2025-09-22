import { u } from '@igorskyflyer/upath'
import { type Dirent, readdirSync } from 'node:fs'

/** Used for maxDepth parameter
 * @readonly
 */
export enum Depth {
  /** All subdirectories */
  All = -1,
  /** Only the root directory */
  Root = 0
}

/** Used for entries filtering parameter
 * @readonly
 */
export enum Entry {
  /** All directory entries - files and subdirectories */
  All = 0xaaa,
  /** Only files */
  FilesOnly = 0xbbb,
  /** Only subdirectories */
  DirectoriesOnly = 0xccc
}

/**
 * Represents information about a directory entry during recursive traversal.
 */
export type RecursiveFilterParams = {
  /** Path of directory entry */
  path: string

  /** Indicates whether the entry is a directory */
  isDirectory: boolean

  /** True if the entry was skipped, often due to lack of permissions */
  wasSkipped: boolean
}

/**
 * Predicate function type for filtering file-system entries.
 */
export type FilterCallback = (
  /** A `RecursiveFilterParams` object containing details about the entry */
  entry: RecursiveFilterParams
) => boolean

/**
 * Options for configuring recursive directory reading.
 */
export type RecursiveDirOptions = {
  /** Function used for filtering when traversing the provided directory */
  filter?: FilterCallback

  /**
   * Indicates which entries to show: files-only, directories-only, or all (default)
   * Possible values:
   * - Entry.FilesOnly
   * - Entry.DirectoriesOnly
   * - Entry.All (default)
   */
  entries?: Entry

  /**
   * The level of child directories to read
   * Possible values:
   * - Depth.All
   * - Depth.Root (default)
   * - any number >= 0
   */
  maxDepth?: Depth

  /** Whether a trailing slash should be added to directory paths */
  addTrailingSlash?: boolean
}

function defaultPredicate(): boolean {
  return true
}

function shouldPush(isDirectory: boolean, entries: Entry) {
  if (isDirectory && entries !== Entry.FilesOnly) {
    return true
  } else if (!isDirectory && entries !== Entry.DirectoriesOnly) {
    return true
  }

  return false
}

function createRecursiveFilterParams(
  path: string,
  isDirectory: boolean,
  wasSkipped: boolean
) {
  return { path, isDirectory, wasSkipped }
}

function recursiveDirSync(
  directory: string,
  options: RecursiveDirOptions = {},
  depth: number = Depth.Root,
  files: string[] = []
): string[] {
  if (!directory) {
    return []
  }

  const {
    filter = defaultPredicate,
    maxDepth = Depth.Root,
    entries = Entry.All,
    addTrailingSlash = false
  } = options

  try {
    const dirEntries = readdirSync(directory, { withFileTypes: true })
    if (dirEntries.length > 0) {
      depth++
    }

    for (const entry of dirEntries) {
      processEntry(entry, directory, depth)
    }
  } catch {
    return []
  }

  return files

  function processEntry(entry: Dirent, baseDir: string, currentDepth: number) {
    const fullPath = u(`${baseDir}/${entry.name}`)
    let path = maxDepth === Depth.Root ? entry.name : fullPath
    let isDir = false

    try {
      isDir = entry.isDirectory()
      if (addTrailingSlash && isDir) {
        path = u(path, true)
      }
    } catch {
      pushIfAllowed(path, isDir, true)
      return
    }

    if (shouldRecurse(isDir, currentDepth)) {
      pushIfAllowed(path, isDir, false)
      if (isDir) {
        recursiveDirSync(fullPath, options, currentDepth, files)
      }
    } else {
      pushIfAllowed(path, isDir, false)
    }
  }

  function pushIfAllowed(path: string, isDir: boolean, skipped: boolean) {
    if (
      filter(createRecursiveFilterParams(path, isDir, skipped)) &&
      shouldPush(isDir, entries)
    ) {
      files.push(path)
    }
  }

  function shouldRecurse(isDir: boolean, currentDepth: number) {
    return isDir && (maxDepth === Depth.All || currentDepth < maxDepth)
  }
}

/**
 * Asynchronously gets files/directories inside the given directory.
 * @param {string} directory the directory whose files/directories should be listed
 * @param {RecursiveDirOptions} [options] additional options
 * @returns {Promise<string[]>} returns Promise\<string[]\>
 */
export async function readDir(
  directory: string,
  options: RecursiveDirOptions
): Promise<string[]> {
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
 * @param {RecursiveDirOptions} [options] additional options
 * @returns {string[]} returns string[]
 */
export function readDirSync(directory: any, options: any): string[] {
  return recursiveDirSync(directory, options)
}

/**
 * RecursiveDir class
 * @class
 */
export class RecursiveDir {
  #options: RecursiveDirOptions

  constructor() {
    this.#options = {
      maxDepth: Depth.Root,
      filter: defaultPredicate,
      entries: Entry.All,
      addTrailingSlash: false
    }
  }

  /**
   * Synchronously gets files/directories inside the given directory.
   * @param {string} directory the directory whose files/directories should be listed
   * @returns {string[]} returns string[]
   */
  readDirSync(directory: string): string[] {
    return recursiveDirSync(directory, this.#options)
  }

  /**
   * Asynchronously gets files/directories inside the given directory.
   * @param {string} directory the directory whose files/directories should be listed
   * @returns {Promise<string[]>} returns Promise\<string[]\>
   */
  async readDir(directory: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      try {
        resolve(recursiveDirSync(directory, this.#options))
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
  entries(value: Entry): RecursiveDir {
    this.#options.entries = value
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
  maxDepth(value: Depth): RecursiveDir {
    if (value >= Depth.All) {
      this.#options.maxDepth = value
    }

    return this
  }

  /**
   * Sets **filter** predicate function used for filtering
   * directory entries (directories/files)
   * @param {FilterCallback} value
   * @returns {RecursiveDir}
   */
  filter(value: FilterCallback): RecursiveDir {
    this.#options.filter = value
    return this
  }

  /**
   * Sets whether a trailing slash should be added to directory entries.
   * @param {boolean} value
   * @returns {RecursiveDir}
   */
  addTrailingSlash(value: boolean): RecursiveDir {
    this.#options.addTrailingSlash = value
    return this
  }
}
