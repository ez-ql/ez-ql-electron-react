const electron = require("electron");
const { Pool, Client } = require("pg");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const { ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const squel = require("squel");
const isDev = require("electron-is-dev");

const connectionString = "postgresql://localhost:5432/BikeStores";
// const ezqlConnectionString = "postgresql://localhost:5432/ez-ql";

let mainWindow;
// let global = { sharedObj: { models: [], currQuery: {selectedModelsAndFields: [], from: '', fields: []} } };

async function createWindow() {
  mainWindow = new BrowserWindow({ width: 900, height: 680 });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));

  console.log("***db schema arg main***");
  const client = new Client({
    host: "localhost",
    database: "ez-ql",
    port: 5432
  });
  client.connect();
  await Promise.all([
    client
      .query(
        "SELECT models.model_id, models.model_name, foreignKeys.relatedModel_id, foreignKeys.model_foreign_field , foreignKeys.relatedModel_primary_field FROM models LEFT JOIN foreignKeys on models.model_id = foreignKeys.model_id"
      )
      .then(res => {
        console.log("res", res.rows);
        relatedTables(res.rows);
        console.log("GLOBAL", global.sharedObj.models);
      })
      .catch(err => console.error(err.stack)),

    client
      .query(
        "SELECT models.model_id, models.model_name, fields.field_name, fields.field_id, fields.field_type, fields.field_example FROM models LEFT JOIN fields on models.model_id = fields.model_id WHERE models.database_id = 1"
      )
      .then(res => {
        "HERE!!!!!!!!!!!!!!!!!";
        relatedFields(res.rows);

        // console.log("global shared", global.sharedObj)
        // event.sender.send("async-db-schema-reply", global.sharedObj.models);
        global.sharedObj = global.sharedObj;
        client.end();
      })
      .catch(err => console.error(err.stack))
  ]);
}

// const pool = new Pool({ connectionString })

// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   pool.end()
// })

// const ezqlClient = new Client({
//   host: "localhost",
//   database: "ez-ql",
//   port: 5432
// });

global.sharedObj = {
  models: [],
  currQuery: {
    from: "", // e.g. 'orders'
    fields: [], // e.g. ['order_id', 'order_date', 'customer_id']
    where: "", // e.g. 'order_date > '2015-12-31''
    qualifiedFields: [], // e.g. ['orders.order_id', 'orders.order_date', 'customers.customer_id']
    joinType: "", // e.g. 'left_join' 4 options e.g. 'join', 'outer_join', 'left_join', 'right_join'
    leftRef: "", // e.g. 'orders.customer_id'  qualified field name (foreign key)
    rightRef: "", // e.g. 'customers.customer_id' qualified field name (primary key)
    group: "", // e.g. 'customers.customer_id, orders.order_date',
    order: [], //e.g. {qualifiedField: customers.last_name", ascending: false} --> DESC, {qualifiedField: "customers.first_name", ascending: true} --> ascending .order("customers.last_name", false)
    // addedModel: [], // array of objects e.g. {model_id: 3 , model_name: '', ...} potentially delete
    // addedModelFields: [], // potentially delete
    selectedModelsAndFields: [] // array of objects
  },
  sqlQuery: "" //sql query string for preview reference
};

// -----DUMMY DATA FOR TESTING------
// global.sharedObj = {
//   models: [],
//   currQuery: {
//     from: "orders",
//     fields: ["order_id", "order_date", "customer_id"],
//     where: "order_date > '2015-12-31'",
//     qualifiedFields: [
//       "COUNT(orders.order_id)",
//       "orders.order_date",
//       "customers.customer_id"
//     ],
//     joinType: "left_join",
//     leftRef: "orders.customer_id",
//     rightRef: "customers.customer_id",
//     group: "customers.customer_id, orders.order_date",
//     addedModel: [],
//     addedModelFields: [],
//     selectedModelsAndFields: [{ model_name: "customers" }]
//   },
//   sqlQuery: ""
// };

const buildSquelQuery = () => {
  const {
    from,
    qualifiedFields,
    joinType,
    leftRef,
    rightRef,
    group,
    where,
    order,
    selectedModelsAndFields
  } = global.sharedObj.currQuery;

  //start with basic query
  let query = squel
    .select()
    .from(from)
    .fields(qualifiedFields);

  //add join method in case joinType exists
  switch (joinType) {
    case "join":
      query = query.join(
        selectedModelsAndFields[0].model_name,
        null,
        `${leftRef} = ${rightRef}`
      );
      break;
    case "right_join":
      query = query.right_join(
        selectedModelsAndFields[0].model_name,
        null,
        `${leftRef} = ${rightRef}`
      );
      break;
    case "left_join":
      query = query.left_join(
        selectedModelsAndFields[0].model_name,
        null,
        `${leftRef} = ${rightRef}`
      );
      break;
    case "outer_join":
      query = query.outer_join(
        selectedModelsAndFields[0].model_name,
        null,
        `${leftRef} = ${rightRef}`
      );
      break;
    default:
      break;
  }

  group && (query = query.group(group));
  where && (query = query.where(where));
  order.length && (order.forEach(sortBy => query = query.order(sortBy.qualifiedField, sortBy.ascendingending)))

  let queryString = query.toString();
  if (queryString.indexOf("OUTER ") > -1) {
    queryString = queryString.replace("OUTER ", "FULL ");
  }
  global.sharedObj.sqlQuery = queryString;
  return queryString;
};

const queryGuard = query => {
  if (query.slice(0, 6) === "SELECT") {
    return query;
  } else {
    throw new Error("Error: Invalid Query");
  }
};

ipcMain.on("async-new-query", async (event, arg) => {
  const query = queryGuard(buildSquelQuery());
  const client = new Client({ connectionString });
  client.connect();
  client
    .query(query)
    .then(res => {
      console.log("first row of results", res.rows[0]);
      console.log("all results", res.rows);
      event.sender.send("async-query-reply", res.rows);
      client.end();
    })
    .catch(err => console.error(err.stack || err));
});

const relatedTables = modelsArr => {
  modelsArr.forEach(model => {
    if (
      global.sharedObj.models.length &&
      global.sharedObj.models.filter(
        globalModel => model.model_id === globalModel.model_id
      ).length
    ) {
      console.log("here!!!!!!!", global.sharedObj.models);
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
  console.log("******RELATEDFIELDS*********");
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
            field_type: field.field_type,
            field_example: field.field_example
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
              field_type: field.field_type,
              field_example: field.field_example
            }
          ];
          console.log("globalModel", globalModel);
          return globalModel;
        } else {
          console.log("globalModel", globalModel);
          return globalModel;
        }
      });
    }
    console.log("GGLOBAL!!!!!!!", global.sharedObj.models);
  });
};

// ipcMain.on("async-selected-db-schema", async (event, arg) => {
//   console.log("***db schema arg main***", arg);
//   const client = new Client({
//     host: "localhost",
//     database: "ez-ql",
//     port: 5432
//   });
//   client.connect();
//   client
//     .query(arg)
//     .then(res => {
//       console.log('res', res.rows)
//       relatedTables(res.rows);
//     })
//     .catch(err => console.error(err.stack));

//   client
//     .query(
//       "SELECT models.model_id, models.model_name, fields.field_name, fields.field_id, fields.field_type, fields.field_example FROM models LEFT JOIN fields on models.model_id = fields.model_id WHERE models.database_id = 1"
//     )
//     .then(res => {
//       relatedFields(res.rows);
//       console.log("global shared", global.sharedObj)
//       event.sender.send("async-db-schema-reply", global.sharedObj.models);
//       client.end();
//     });
// });

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
