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

### API

- [Function-based](#λ-function-based),
- [Class-based](#-class-based)

<br>

#### λ Function-based

<br>

```js
async function readDir(directory, options): Promise<string[] | null>
```

Asynchronously gets files/directories inside the given directory.

<br>

**Params**

_**directory**_: `String` - the directory whose files/directories should be listed,

_**options**_: `RecursiveDirOptions` - additional options.

<br>

```js
 function readDirSync(directory, options): string[] | null
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
function readDirSync(directory): string[] | null
```

Synchronously gets files/directories inside the given directory.

<br>

**Params**

_**directory**_: `String` - the directory whose files/directories should be listed.

<br>

```js
function readDir(directory): Promise<string[] | null>
```

Asynchronously gets files/directories inside the given directory.

<br>

**Params**

_**directory**_: the directory whose files/directories should be listed.

<br>

```js
function setShowEntries(value): self
```

Sets **showEntries** which controls whether to list files-only, directories-only or **both** (**default**).

**Params**
**_value_**: `RecursiveDirEntries` - a value of `RecursiveDirEntries` type with three possible values,

- **`All`**,
- **`FilesOnly`**,
- **`DirectoriesOnly`**.

<br>

```js
function setMaxDepth(value): self
```

Sets **maxDepth** which controls how many child directories' entries are being listed.

<br>

**Params**

**_value_**: `Number` - the new `maxDepth` value.

<br>

You can use the 2 predefined values or use an arbitrary value. The predefined values are as follows:

- **`AllDirs`** = -1 (**default**) - return all subdirectories entries,
- **`RootDir`** = 0 - return only root directory's entries.

To use arbitrary values the provided `value` parameter must comply with the expression

<p align="center">
<code>
maxDepth >= RootDir</code>
</p>

meaning

<p align="center">
<code>
maxDepth >= 0</code>
</p>

<br>

The value of `0` means that only directory entries found in the directory specified when calling either `readDir()` or `readDirSync()` methods are returned. By increasing the number we can set the depth/level of subdirectories that the method should return, e.g.

<br>

`maxDepth = RootDir`

```js
setMaxDepth(RootDir)
// return only the files/directories in the current directory
```

<br>

`maxDepth = 3`

```js
setMaxDepth(3)
// return the files/directories in the current director files/directories 3-levels deep
```

<br>

`maxDepth = AllDirs`

```js
setMaxDepth(AllDirs)
// return all child files/directories in the current directory
```

<br>
<br>

```js
function setFilter(value): self
```

Sets **filter** predicate function used for filtering directory entries (directories/files).

<br>

**Params**

_value_: `FilterCallback` - the filter function to use when filtering directory entries.
