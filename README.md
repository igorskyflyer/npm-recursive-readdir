## 🔁 Recursive `readdir()`

<br>

<p align="center">
	<img src="https://github.com/igorskyflyer/npm-recursive-readdir/raw/main/assets/recursive-readdir.png" alt="Recursive-Readdir logo" width="180" height="180">
</p>

<br>

<p align="center">
  <img src="https://github.com/igorskyflyer/npm-recursive-readdir/workflows/tests/badge.svg">
</p>

<br>

📖 Provides advanced recursive readdir() and readdirSync() functions with high-level of Node-compatibility and much more. 📁

<br>
<br>

> ❓ Did you know? 🤔

> I've built this npm module because I needed a reliable and efficient npm module for listing directories while building another one of my projects, a Visual Studio Code extension called **[New Folder](https://github.com/igorskyflyer/vscode-new-folder)** and I needed to create a custom QuickPick dialog allowing the user to pick a root directory.

<br>

### Features

✅ both class-based and function-based approaches available,

✅ TypeScript ready, declaration files (`d.ts`) included,

✅ recursive traversal,

✅ maximum depth of traversal configurability,

✅ file-only filtering,

✅ directory-only filtering,

✅ file/directory path name filtering,

✅ error detection methods,

✅ file/directory inaccessibility detection methods,

✅ multiple output formats,

✅ custom filter function,

✅ async and sync methods available,

✅ path-safety, see [uPath](https://www.npmjs.com/package/@igor.dvlpr/upath),

✅ universal paths supported, see [uPath](https://www.npmjs.com/package/@igor.dvlpr/upath). 🎉

<br>

### Usage

Install it by running:

```shell
npm i "@igor.dvlpr/recursive-readdir"
```

<br>

#### Examples

```js
const { readDirSync } = require('@igor.dvlpr/recursive-readdir')
const testingPath = './somePath'

console.log(readDirSync('non-existent-directory')) // returns []

console.log(
  readDirSync(testingPath, {
    maxDepth: Depth.All,
    filter: (entry) => entry.isDirectory,
  })
) // returns only subdirectories (all subdirectories)

// the following can be used interchangeably
console.log(
  readDirSync(testingPath, {
    maxDepth: Depth.All,
    entries: Entry.DirectoriesOnly,
  })
) // returns only subdirectories (all subdirectories)

console.log(
  readDirSync(testingPath, {
    maxDepth: Depth.All,
    entries: Entry.FilesOnly,
    filter: (entry) => entry.path.indexOf('.js') > -1,
  })
) // returns only JavaScript - .js files found in all (sub)directories
```

<br>

### API

- [Function-based](#λ-function-based),
- [Class-based](#-class-based)

<br>

#### λ Function-based

<br>

```js
async function readDir(directory, options): Promise<string[]>
```

Asynchronously gets files/directories inside the given directory.

<br>

**Params**

_**directory**_: `String` - the directory whose files/directories should be listed,

_**options**_: `RecursiveDirOptions` - additional options.

<br>

```js
 function readDirSync(directory, options): string[]
```

Synchronously gets files/directories inside the given directory.

<br>

**Params**

_**directory**_: `String` - the directory whose files/directories should be listed,

_**options**_: `RecursiveDirOptions` - additional options.

<br>

#### 💎 Class-based

For own convenience and code-reuse you can use the class-based approach.

Define the options once and (re)call the `readDirSync()`/`readDir()` when needed.

<br>

```js
class RecursiveDir
```

<br>
<br>

**Available methods**

```js
function readDirSync(directory): string[]
```

Synchronously gets files/directories inside the given directory.

<br>

**Params**

_**directory**_: `String` - the directory whose files/directories should be listed.

<br>

```js
function readDir(directory): Promise<string[]>
```

Asynchronously gets files/directories inside the given directory.

<br>

**Params**

_**directory**_: the directory whose files/directories should be listed.

<br>

```js
function entries(value): RecursiveDir
```

Sets the **entries** property which controls whether to list files-only, directories-only or **both** (**default**).

**Params**
**_value_**: `Entry` - a value with three possible values - provided as class consts,

- **`Entry.All`**,
- **`Entry.FilesOnly`**,
- **`Entry.DirectoriesOnly`**.

<br>

```js
function maxDepth(value): RecursiveDir
```

Sets **maxDepth** which controls how many child directories' entries are being listed.

<br>

**Params**

**_value_**: `Depth` - the new `maxDepth` value.

<br>

You can use the 2 predefined values or use an arbitrary value. The predefined values are as follows:

- **`Depth.All`** = -1 - return all subdirectories entries,
- **`Depth.Root`** = 0 (**default**) - return only root directory's entries.

> 🤔 Why the default value of `maxDepth` is **_NOT_** `Depth.All` when this module provides recursive and subdirectory file traversal?
> <br>

> ⚡ Simple, because you need to explicitly set it to that value because traversal through all child subdirectories is very resource/time consuming, just imagine setting the `directory` parameter to the root of your drive and in conjunction with `maxDepth = Depth.All`. 😲

To use arbitrary values the provided `value` parameter must comply with the expression

<p align="center">
<code>
maxDepth >= Depth.Root</code>
</p>

i.e.,

<p align="center">
<code>
maxDepth >= 0</code>
</p>

<br>

The value of `0` means that only directory entries found in the directory specified when calling either `readDir()` or `readDirSync()` methods are returned. By increasing the number we can set the depth/level of subdirectories that the method should return, e.g.

<br>

`maxDepth = Depth.Root`

```js
maxDepth(Depth.Root)
// return only the files/directories in the current directory
```

<br>

`maxDepth = 3`

```js
maxDepth(3)
// return the files/directories in the current director files/directories 3-levels deep
```

<br>

`maxDepth = Depth.All`

```js
maxDepth(Depth.All)
// return all child files/directories in the current directory
```

<br>
<br>

```js
function filter(value): RecursiveDir
```

Sets **filter** predicate function used for filtering directory entries (directories/files).

<br>

**Params**

_value_: `FilterCallback` - the filter function to use when filtering directory entries.

<br>
