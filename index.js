import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Import config
import connectDB from "./config/db.js";

// Import routes
import userRoutes from "./routes/userRoutes.js";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Get current directory name (alternative to __dirname in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import response logger

// Middleware

app.use(cors({ origin: "http://localhost:3000" }));

app.use(morgan("dev"));
// In your index.js, make sure you have these lines:
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Add this before your routes
app.use(
  express.json({
    verify: (req, res, buf) => {
      try {
        JSON.parse(buf.toString());
      } catch (e) {
        console.error("Invalid JSON received:", buf.toString());
        throw new Error("Invalid JSON");
      }
    },
  })
);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use("/api/auth", userRoutes);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
