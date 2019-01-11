const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { Client } = require("pg");
const PORT = process.env.PORT || 1337;
const app = express();

const localConnectionString = "postgresql://localhost:5432/BikeStores";

const databaseUrl = process.env.DATABASE_URL || localConnectionString;

const createApp = () => {
  app.use(morgan("dev"));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.post("/data", async (req, res, next) => {
    const { query } = req.body;
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
