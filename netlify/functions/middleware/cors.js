import cors from "cors";

// Configure CORS to only allow requests from the React app
const allowedOrigins = [
  process.env.URL, // Netlify site URL
  process.env.DEPLOY_PRIME_URL, // Netlify deploy URL
  "http://localhost:8888", // Netlify dev
  "http://localhost:5173", // Vite dev
  "http://localhost:3000", // Common dev port
].filter(Boolean);

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (same-origin requests, mobile apps, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // Check if origin is in allowed list
    const isAllowed =
      allowedOrigins.some((allowed) => origin.startsWith(allowed)) ||
      origin.includes("localhost");

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(
        new Error(
          "Not allowed by CORS - This API can only be accessed from the authorized application"
        )
      );
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400, // 24 hours
});

