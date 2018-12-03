const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { Client } = require("pg");
const PORT = process.env.PORT || 1337;
const app = express();

const localConnectionString = "postgresql://http://localhost:5432/BikeStores";

const databaseUrl = process.env.DATABASE_URL || localConnectionString;

const createApp = () => {
  app.use(morgan("dev"));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.post("http://localhost:5432/data", async (req, res, next) => {
    console.log("REQ.BODY", req.body);
    const { query } = req.body;
    console.log("QUERY", query);
    try {
      const client = new Client(localConnectionString);
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

  app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public/index.html"));
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
