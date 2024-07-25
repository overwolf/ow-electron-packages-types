# @overwolf/ow-electron-packages-types

![npm](https://img.shields.io/npm/v/@overwolf/ow-electron-packages-types)

Overwolf Electron packages type definition files for autocompletion and documentation purposes.  

## Installation

To install this package, simply run

```
$ npm i --save-dev @overwolf/ow-electron-packages-types
```

In newer versions of ow-electron, this package should be automatically bundled in.

## Usage

To use this package in your Typescript project, simply import the relevant members from any relevant files

```
import "@overwolf/ow-electron-packages-types";
```

Alternatively, you can add it directly to your tsconfig file, like so:
```
{
  "compilerOptions":{
    ...,
    "types": [
      ...,
      "@overwolf/ow-electron-packages-types"
      ...
    ]
    ...,
  }
  ...
}
```

This way, it will always be available in all of your files, even without an explicit import.

## Getting started with ow-electron packages

[ow-electron packages](./docs/packages.md)