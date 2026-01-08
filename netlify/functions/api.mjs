// import express from "express";
// import serverless from "serverless-http";
// import routes from "./routes/index.js";
// import { corsMiddleware } from "./middleware/cors.js";
// import { securityHeadersMiddleware } from "./middleware/securityHeaders.js";
// import { rateLimiterMiddleware } from "./middleware/rateLimiter.js";

// import { sequelize } from "./models/index.js";

// sequelize
//   .sync({ force: true }) // ← use force ONCE
//   .then(() => {
//     console.log("✅ Database synced");
//   })
//   .catch((err) => {
//     console.error("❌ DB sync failed", err);
//   });

// const app = express();

// // Apply middleware
// app.use(corsMiddleware);
// app.use(securityHeadersMiddleware);
// app.use(express.json());
// app.use(rateLimiterMiddleware);

// app.use("/api/", routes);

// export const handler = serverless(app);

import express from "express";
import serverless from "serverless-http";

import routes from "./routes/index.js";
import { corsMiddleware } from "./middleware/cors.js";
import { securityHeadersMiddleware } from "./middleware/securityHeaders.js";
import { rateLimiterMiddleware } from "./middleware/rateLimiter.js";

import { sequelize, initializeDatabase } from "./models/index.js";

const app = express();

// Boot DB once (cold start)
try {
  await initializeDatabase();

  // Dev only: create/adjust tables
  await sequelize.sync({ alter: true });

  console.log("✅ Database initialized + synced");
} catch (err) {
  console.error("❌ DB startup failed:", err);
  // Fail fast so requests don't hit a half-booted server
  throw err;
}

// Middleware
app.use(corsMiddleware);
app.use(securityHeadersMiddleware);
app.use(express.json());
app.use(rateLimiterMiddleware);

// Routes
app.use("/api", routes);

// Export Netlify handler
export const handler = serverless(app);
