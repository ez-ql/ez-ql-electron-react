const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { Client } = require("pg");
const PORT = process.env.PORT || 1338;
const app = express();

const localConnectionString = "postgresql://localhost:5432/ez-ql";

const databaseUrl = process.env.DATABASE_URL || localConnectionString;

// const addDbIdToQuery = (query, dbId) => {
//     !query.contains("WHERE")
//       ? (query = `${query.slice(0, -1)} WHERE databaseId = ${
//           dbId
//         };`)
//       : (query = `${query.slice(0, -1)} AND databaseId = ${
//           dbId
//         };`);
// }

const createApp = () => {
  app.use(morgan("dev"));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.post("/customer/:databaseId/models", async (req, res, next) => {
    console.log('REQ.BODY', req.body)
    let { query } = req.body;
    // query = addDbIdToQuery(query, req.params.databaseId)
    try {
      const client = new Client(databaseUrl);
      await client.connect();
      const results = await client.query(query);
      res.status(201).send(results);
      client.end();
    } catch (error) {
      next(error);
    }
  });

  app.post("/customer/:databaseId/users", async (req, res, next) => {
    let { query } = req.body;
    // query = addDbIdToQuery(query, req.params.databaseId)
    try {
      const client = new Client(databaseUrl);
      await client.connect();
      const results = await client.query(query);
      res.status(201).send(results);
      client.end();
    } catch (error) {
      next(error);
    }
  });

  app.post("/customer/:databaseId/databases", async (req, res, next) => {
    let { query } = req.body;
    // query = addDbIdToQuery(query, req.params.databaseId)
    try {
      const client = new Client(databaseUrl);
      await client.connect();
      const results = await client.query(query);
      res.status(201).send(results);
      client.end();
    } catch (error) {
      next(error);
    }
  });

  app.post("/customer/:databaseId/projects", async (req, res, next) => {
    let { query } = req.body;
    // query = addDbIdToQuery(query, req.params.databaseId)
    try {
      const client = new Client(databaseUrl);
      await client.connect();
      const results = await client.query(query);
      res.status(201).send(results);
      client.end();
    } catch (error) {
      next(error);
    }
  });

  app.post("/customer/:databaseId/userQueries", async (req, res, next) => {
    let { query } = req.body;
    // query = addDbIdToQuery(query, req.params.databaseId)
    try {
      const client = new Client(databaseUrl);
      await client.connect();
      const results = await client.query(query);
      res.status(201).send(results);
      client.end();
    } catch (error) {
      next(error);
    }
  });

  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error("Not found");
      err.status = 404;
      next(err);
    } else {
      next();
    }
  });

  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || "Internal server error");
  });
};

const startListening = () => {
  app.listen(PORT, () => {
    console.log(`express server listening on port ${PORT}`);
  });
};

async function bootApp() {
  await createApp();
  await startListening();
}

if (require.main === module) {
  bootApp();
} else {
  createApp();
}
