<div align="center">
  <img src="https://raw.githubusercontent.com/igorskyflyer/npm-resursive-readdir/main/media/recursive-readdir.png" alt="Icon of Recursive ReadDir" width="256" height="256">
  <h1>Recursive ReadDir</h1>
</div>

<blockquote align="center">
  Recursive Directory Reading • Sync And Async Usage • Flexible Filters • Depth Control
</blockquote>

<h4 align="center">
  📖 Fast, type-safe recursive directory reader for Node.js with depth control, entry filtering, and sync/async APIs. 📁
</h4>

<br>
<br>

## 📃 Table of Contents

- [Features](#-features)
- [Motivation](#-features)
- [Usage](#-usage)
- [API](#-api)
  - [Function-based](#λ-function-based)
  - [Class-based](#-class-based)
- [Examples](#️-examples)
- [Changelog](#-changelog)
- [Support](#-support)
- [License](#-license)
- [Related](#-related)
- [Author](#-author)

<br>
<br>

## 🤖 Features

- 📂 Reads directories recursively with precise depth control
- 🎯 Filters results by files-only, directories-only, or all entries
- ⚡ Supports both synchronous and asynchronous operations
- 🧩 Accepts custom filter functions for advanced selection
- ✨ Optionally adds trailing slashes to directory paths
- 🛡️ Skips unreadable entries without stopping traversal
- 🏗 Provides a fluent class API for easy configuration
- 💻 Cross-platform paths, powered by [**uPath**](https://www.npmjs.com/package/@igorskyflyer/upath)

<br>

## 🎯 Motivation

This npm module was built to provide a reliable and efficient way of listing directories while another project was being developed - a Visual Studio Code extension called [**New Folder**](https://github.com/igorskyflyer/vscode-new-folder), where a custom QuickPick dialog was required to allow the selection of a root directory.

<br>

## 🕵🏼 Usage

Install it by executing any of the following, depending on your preferred package manager:

```bash
pnpm add @igorskyflyer/recursive-readdir
```

```bash
yarn add @igorskyflyer/recursive-readdir
```

```bash
npm i @igorskyflyer/recursive-readdir
```

<br>
<br>

## 🤹🏼 API

### λ Function-based

```ts
async function readDir(directory: string, options: RecursiveDirOptions): Promise<string[]>
```

Asynchronously gets files/directories inside the given directory.

<br>

**Params**

_**directory**_: `string` - the directory whose files/directories should be listed,

_**options**_: `RecursiveDirOptions` - additional options.

<br>

```ts
 function readDirSync(directory: string, options: RecursiveDirOptions): string[]
```

Synchronously gets files/directories inside the given directory.

<br>

**Params**

_**directory**_: `string` - the directory whose files/directories should be listed,

_**options**_: `RecursiveDirOptions` - additional options.

<br>

### 💎 Class-based

For own convenience and code-reuse you can use the class-based approach.

Define the options once and (re)call the `readDirSync()`/`readDir()` when needed.

<br>

```ts
class RecursiveDir
```

<br>

**Available methods**

```ts
function readDirSync(directory: string): string[]
```

Synchronously gets files/directories inside the given directory.

<br>

**Params**

_**directory**_: `string` - the directory whose files/directories should be listed.

<br>

```ts
function readDir(directory: string): Promise<string[]>
```

Asynchronously gets files/directories inside the given directory.

<br>

**Params**

_**directory**_: `string` - the directory whose files/directories should be listed.

<br>

```ts
function entries(value: Entry): RecursiveDir
```

Sets the **entries** property which controls whether to list files-only, directories-only or **both** (**default**).

**Params**
**_value_**: `Entry` - a value with three possible values - provided as class consts,

- **`Entry.All`**,
- **`Entry.FilesOnly`**,
- **`Entry.DirectoriesOnly`**.

<br>

```ts
function maxDepth(value: Depth): RecursiveDir
```

Sets **maxDepth** which controls how many child directories' entries are being listed.

<br>

**Params**

**_value_**: `Depth` - the new `maxDepth` value.

<br>

You can use the 2 predefined values or use an arbitrary value. The predefined values are as follows:

- **`Depth.All`** = -1 - return all subdirectories entries,
- **`Depth.Root`** = 0 (**default**) - return only root directory's entries.

> ### ℹ️ NOTE
>
> #### Why the default value of `maxDepth` is **_NOT_** `Depth.All`?
>
> Simple, because you need to explicitly set it to that value because traversal through all child subdirectories is very resource/time consuming, just imagine setting the `directory` parameter to the root of your drive and in conjunction with `maxDepth = Depth.All`. 
>

To use arbitrary values the provided `value` parameter must comply with the expression `maxDepth >= Depth.Root` i.e., `maxDepth >= 0`.  

The value of `0` means that only directory entries found in the directory specified when calling either `readDir()` or `readDirSync()` methods are returned. By increasing the number we can set the depth/level of subdirectories that the method should return, e.g.

<br>

`maxDepth = Depth.Root`

```ts
maxDepth(Depth.Root)
// return only the files/directories in the current directory
```

<br>

`maxDepth = 3`

```ts
maxDepth(3)
// return the files/directories in the current director files/directories 3-levels deep
```

<br>

`maxDepth = Depth.All`

```ts
maxDepth(Depth.All)
// return all child files/directories in the current directory
```

<br>
<br>

```ts
function filter(value: FilterCallback): RecursiveDir
```

Sets **filter** predicate function used for filtering directory entries (directories/files).

<br>

**Params**

_value_: `FilterCallback` - the filter function to use when filtering directory entries.

<br>
<br>

```ts
function addTrailingSlash(value: boolean): RecursiveDir
```

Sets whether a trailing slash should be added to directory entries.

 <br>

**Params**

_value_: `boolean` - a Boolean indicating whether a trailing slash should be added to directory entries.

<br>
<br>

## 🗒️ Examples

```ts
import { readDirSync, Depth, Entry, RecursiveDir } from '@igorskyflyer/recursive-readdir'
const testingPath: string = './somePath'

// Function-based approach

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

// Class-based approach

const dir: RecursiveDir = new RecursiveDir()

dir
  .maxDepth(Depth.All)
  .entries(Entry.FilesOnly)
  .filter((entry) => entry.path.indexOf('.md') > -1)

console.log(dir.readDirSync(testingPath)) // returns only .md (Markdown) files found in all (sub)directories
```

<br>
<br>

## 📝 Changelog

📑 The changelog is available here, [CHANGELOG.md](https://github.com/igorskyflyer/npm-resursive-readdir/blob/main/CHANGELOG.md).

<br>
<br>

## 🪪 License

Licensed under the MIT license which is available here, [MIT license](https://github.com/igorskyflyer/npm-resursive-readdir/blob/main/LICENSE).

<br>
<br>

## 💖 Support

<div align="center">
  I work hard for every project, including this one and your support means a lot to me!
  <br>
  Consider buying me a coffee. ☕
  <br>
  <br>
  <a href="https://ko-fi.com/igorskyflyer" target="_blank"><img src="https://raw.githubusercontent.com/igorskyflyer/igorskyflyer/main/assets/ko-fi.png" alt="Donate to igorskyflyer" width="180" height="46"></a>
  <br>
  <br>
  <em>Thank you for supporting my efforts!</em> 🙏😊
</div>

<br>
<br>

## 🧬 Related

[**@igorskyflyer/unc-path**](https://www.npmjs.com/package/@igorskyflyer/unc-path)

> _🥽 Provides ways of parsing UNC paths and checking whether they are valid. 🎱_

<br>

[**@igorskyflyer/comment-it**](https://www.npmjs.com/package/@igorskyflyer/comment-it)

> _📜 Formats the provided string as a comment, either a single or a multi line comment for the given programming language. 💻_

<br>

[**@igorskyflyer/upath**](https://www.npmjs.com/package/@igorskyflyer/upath)

> _🎍 Provides a universal way of formatting file-paths in Unix-like and Windows operating systems as an alternative to the built-in path.normalize(). 🧬_

<br>

[**@igorskyflyer/valid-path**](https://www.npmjs.com/package/@igorskyflyer/valid-path)

> _🧰 Determines whether a given value can be a valid file/directory name. 🏜_

<br>

[**@igorskyflyer/strip-html**](https://www.npmjs.com/package/@igorskyflyer/strip-html)

> _🥞 Removes HTML code from the given string. Can even extract text-only from the given an HTML string. ✨_

<br>
<br>
<br>

## 👨🏻‍💻 Author
Created by **Igor Dimitrijević** ([*@igorskyflyer*](https://github.com/igorskyflyer/)).
