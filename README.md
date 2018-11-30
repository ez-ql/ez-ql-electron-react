ez-ql is a point-and-click desktop GUI for querying PostgreSQL databases intended for non-technical business users.
* Step-by-step query-builder allowing for the following SQL operations: join, aggregate, filter, sort, groupby
* Built with Electron.js, boostrapped with Create-React-App
* Packages and libraries: squel.js, node-postgres, MaterialUI

## Requirements
* node v8.11.1
* npm v6.4.1

## Available Scripts

In the project directory, you can run:

### `npm install`

Runs installation of all dependencies listed in `package.json`. *Required* for the following two scripts.

### `npm run electron-dev`

Runs the app in the development mode.<br>
Will open a Chromium Browser Window instance serving on [http://localhost:3000 (http://localhost:3000)].

If you make edits to the code while the window is open, type Ctrl-Shift-R to refresh the window.<br>
You will also see any lint errors in the console.

## Building for All Platforms

### `npm run electron-pack`

Builds the app for production to the `build` folder.<br>
Also generates distributable binaries to install the app to local OS in the `dist` folder.

### For Mac:
Building on a Mac will generate a standard `.dmg` file.

### For Linux:
Building on Linux will generate a `.AppImage` file. 

You can install and open either of these files by double-clicking them in your file explorer GUI or from a terminal by running<br> `./.ez-ql...`
