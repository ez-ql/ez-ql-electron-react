const electron = require("electron");
const { Pool, Client } = require("pg");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");

const connectionString = 'postgresql://localhost:5432/plantr'

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

const client =  new Client({ connectionString })

client.connect()

client.query('SELECT * from gardeners', (err, res) => {
  console.log(err, res)
  client.end()
})

const db = {
  client: "pg",
  connection: `postgres://localhost:5432/plantr`,
  pool: {
    afterCreate: function(cnxn, done) {
      cnxn.query('SET timezone="UTC";', function(err) {
        if (err) {
          done(err, cnxn);
        } else {
          const results = cnxn.query("SELECT * from gardners;", function(err) {
            console.log(results)
            done(err, cnxn);
          });
        }
      });
    }
  }
};

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
