import express from "express";
import serverless from "serverless-http";
import routes from "./routes/index.js";
import { corsMiddleware } from "./middleware/cors.js";
import { securityHeadersMiddleware } from "./middleware/securityHeaders.js";
import { rateLimiterMiddleware } from "./middleware/rateLimiter.js";

const app = express();

// Apply middleware
app.use(corsMiddleware);
app.use(securityHeadersMiddleware);
app.use(express.json());
app.use(rateLimiterMiddleware);

app.use("/api/", routes);

export const handler = serverless(app);
