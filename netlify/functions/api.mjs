import express from "express";
import serverless from "serverless-http";

import routes from "./routes/index.js";
import { corsMiddleware } from "./middleware/cors.js";
import { securityHeadersMiddleware } from "./middleware/securityHeaders.js";
import { rateLimiterMiddleware } from "./middleware/rateLimiter.js";

import { sequelize, initializeDatabase } from "./models/index.js";
import cookieParser from "cookie-parser";

const app = express();

try {
  await initializeDatabase();

  // Dev only: create/adjust tables
  await sequelize.sync({ alter: true });

  console.log("✅ Database initialized + synced");
} catch (err) {
  console.error("❌ DB startup failed:", err);
  throw err;
}

// Middleware
app.use(corsMiddleware);

// handle preflight for ALL routes
app.options("*", corsMiddleware);

app.use(securityHeadersMiddleware);
app.use(express.json());
app.use(rateLimiterMiddleware);

app.use(cookieParser());

// Routes
app.use("/api", routes);

// Export Netlify handler
export const handler = serverless(app);
