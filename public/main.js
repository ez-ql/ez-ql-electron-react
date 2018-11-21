const electron = require("electron");
const { Pool, Client } = require("pg");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const { ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");

const connectionString = "postgresql://localhost:5432/BikeStores";
// const ezqlConnectionString = "postgresql://localhost:5432/ez-ql";

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
      console.log(res.rows[0]);
      event.sender.send("async-query-reply", res.rows);
      client.end();
    })
    .catch(err => console.error(err.stack));
});

global.sharedObj = {
  models: [],
  currQuery: {
    from: "orders",
    fields: ["order_id", "order_status", "order_date", "customer_id", "first_name", "last_name"],
    addedTables: ["customers"],
    group: '',
    where: '',
    qualifiedFields: ["orders.order_id"],
    selectedModelsAndFields: []
  }
};

const relatedTables = modelsArr => {
  modelsArr.forEach(model => {
    if (
      global.sharedObj.models.length &&
      global.sharedObj.models.filter(
        globalModel => model.model_id === globalModel.model_id
      ).length
    ) {
      global.sharedObj.models = global.sharedObj.models.map(globalModel => {
        if (globalModel.model_id === model.model_id) {
          globalModel.related_models.push({
            relatedmodel_id: model.relatedmodel_id,
            model_foreign_field: model.model_foreign_field,
            relatedmodel_primary_field: model.relatedmodel_primary_field
          });
          return globalModel;
        } else {
          return globalModel;
        }
      });
    } else {
      global.sharedObj.models.push({
        model_id: model.model_id,
        model_name: model.model_name,
        related_models: [
          {
            relatedmodel_id: model.relatedmodel_id,
            model_foreign_field: model.model_foreign_field,
            relatedmodel_primary_field: model.relatedmodel_primary_field
          }
        ]
      });
    }
  });
};

const relatedFields = fieldsArr => {
  fieldsArr.forEach(field => {
    if (
      global.sharedObj.models.filter(
        globalModel => field.model_id === globalModel.model_id
      )[0].fields
    ) {
      global.sharedObj.models.map(globalModel => {
        if (globalModel.model_id === field.model_id) {
          globalModel.fields.push({
            field_name: field.field_name,
            field_id: field.field_id,
            field_type: field.field_type
          });
          return globalModel;
        } else {
          return globalModel;
        }
      });
    } else {
      global.sharedObj.models.map(globalModel => {
        if (globalModel.model_id === field.model_id) {
          globalModel.fields = [
            {
              field_name: field.field_name,
              field_id: field.field_id,
              field_type: field.field_type
            }
          ];
          return globalModel;
        } else {
          return globalModel;
        }
      });
    }
  });
};

ipcMain.on("async-selected-db-schema", async (event, arg) => {
  console.log("***db schema arg main***", arg);
  const client = new Client({
    host: "localhost",
    database: "ez-ql",
    port: 5432
  });
  client.connect();
  client
    .query(arg)
    .then(res => {
      console.log("res", res.rows);
      relatedTables(res.rows);
    })
    .catch(err => console.error(err.stack));

  client
    .query(
      "SELECT models.model_id, models.model_name, fields.field_name, fields.field_id, fields.field_type FROM models LEFT JOIN fields on models.model_id = fields.model_id WHERE models.database_id = 1"
    )
    .then(res => {
      relatedFields(res.rows);
      console.log("global shared", global.sharedObj);
      event.sender.send("async-db-schema-reply", global.sharedObj.models);
      client.end();
    });
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
