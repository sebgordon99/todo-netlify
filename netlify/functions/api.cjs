// import express from "express";
// import serverless from "serverless-http";

// import routes from "./routes/index.js";
// import { corsMiddleware } from "./middleware/cors.js";
// import { securityHeadersMiddleware } from "./middleware/securityHeaders.js";
// import { rateLimiterMiddleware } from "./middleware/rateLimiter.js";

// import { sequelize, initializeDatabase } from "./models/index.js";
// import cookieParser from "cookie-parser";

// const app = express();

// try {
//   await initializeDatabase();

//   // Dev only: create/adjust tables
//   await sequelize.sync({ alter: true });

//   console.log("✅ Database initialized + synced");
// } catch (err) {
//   console.error("❌ DB startup failed:", err);
//   throw err;
// }

// // Middleware
// app.use(corsMiddleware);

// // handle preflight for ALL routes
// app.options("*", corsMiddleware);

// app.use(securityHeadersMiddleware);
// app.use(express.json());
// app.use(rateLimiterMiddleware);

// app.use(cookieParser());

// // Routes
// app.use("/api", routes);

// // Export Netlify handler
// export const handler = serverless(app);


const express = require("express");
const serverless = require("serverless-http");
const cookieParser = require("cookie-parser");

const routes = require("./routes/index.js");
const { corsMiddleware } = require("./middleware/cors.js");
const { securityHeadersMiddleware } = require("./middleware/securityHeaders.js");
const { rateLimiterMiddleware } = require("./middleware/rateLimiter.js");

const { sequelize, initializeDatabase } = require("./models/index.js");

const app = express();

// Boot DB once (cold start)
(async () => {
  try {
    await initializeDatabase();
    await sequelize.sync({ alter: true }); // consider disabling in prod later
    console.log("✅ Database initialized + synced");
  } catch (err) {
    console.error("❌ DB startup failed:", err);
    throw err;
  }
})();

// Middleware
app.use(corsMiddleware);
app.options("*", corsMiddleware);

app.use(securityHeadersMiddleware);
app.use(express.json());
app.use(rateLimiterMiddleware);

app.use(cookieParser());

// Routes
app.use("/api", routes);

// Export Netlify handler
exports.handler = serverless(app);
