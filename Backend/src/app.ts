import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import { ZodError } from "zod";
import env from "@/config/env";
import { HttpError } from "@/schema/errors";
import ratingRoutes from "@/routes/rating.routes";
import commentRoutes from "@/routes/comment.routes";

const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
  }),
);

app.use(express.json());

app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} → ${res.statusCode}`);
  });

  next();
});

app.get("/", (_req, res) => {
  res.json({
    message: "Anime Watchlist API is running",
  });
});

app.use("/api/ratings", ratingRoutes);
app.use("/api/comments", commentRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Express 5 forwards rejected promises from async handlers here.
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Invalid request",
      details: err.issues.map((i) => `${i.path.join(".") || "value"}: ${i.message}`),
    });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  // Malformed JSON body, rejected by express.json()
  if (err?.type === "entity.parse.failed") {
    res.status(400).json({ error: "Request body must be valid JSON" });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
};

app.use(errorHandler);

export default app;
