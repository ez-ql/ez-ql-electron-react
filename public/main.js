const electron = require("electron");
const { Pool, Client } = require("pg");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const { ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");

const connectionString = "postgresql://localhost:5432/BikeStores";

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 900, height: 680 });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
}

// const pool = new Pool({ connectionString })

// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   pool.end()
// })

ipcMain.on("async-new-query", async (event, arg) => {
  console.log("******* arg *********", arg);
  const client = new Client({ connectionString });
  client.connect();

  client
    .query(arg)
    .then(res => {
      console.log("first row of results", res.rows[0]);
      console.log("all results", res.rows);
      event.sender.send("async-query-reply", res.rows);
      client.end();
    })
    .catch(err => console.error(err.stack));
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
