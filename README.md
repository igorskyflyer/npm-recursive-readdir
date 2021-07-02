## 🔁 Recursive `readdir()`

<br>

<p align="center">
	<img src="https://github.com/igorskyflyer/npm-recursive-readdir/raw/main/assets/recursive-readdir.png" alt="Recursive-Readdir logo" witdth="180" height="180">
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

✅ recursive transversal,

✅ maximum depth of transversal configurability,

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

- [function-based](#λ-function-based),
- [class-based](#-class-based)

<br>

#### λ function-based

<br>

```js
async function readDir(directory, options): Promise<string[]|null>
```

Asynchronously gets files/directories inside the given directory.

<br>

**Params**

_**directory**_: `String` - the directory whose files/directories should be listed,

_**options**_: `RecursiveDirOptions` - additional options.

<br>

```js
 function readDirSync(directory, options): string[]|null
```

Synchronously gets files/directories inside the given directory.

<br>

**Params**

_**directory**_: `String` - the directory whose files/directories should be listed,

_**options**_: `RecursiveDirOptions` - additional options.

<br>

#### 💎 class-based
