import express from "express";
import { identifyAspects, identifyBatchAspects } from "./aspects.js";

const app = express();

app.use(express.json({ limit: "1mb" }));

app.get("/", (request, response) => {
  response.json({
    name: "motor-aspects",
    description: "API para calculo geometrico de aspectos astrologicos.",
    endpoints: {
      health: "GET /health",
      calculateAspect: "POST /aspects",
      calculateBatchAspects: "POST /aspects/batch"
    }
  });
});

app.get("/health", (request, response) => {
  response.json({
    status: "ok"
  });
});

app.post("/aspects", (request, response) => {
  try {
    const { degreeA, degreeB } = request.body;

    if (degreeA === undefined || degreeB === undefined) {
      return response.status(400).json({
        error: "degreeA and degreeB are required."
      });
    }

    const result = identifyAspects(degreeA, degreeB);

    response.json(result);
  } catch (error) {
    response.status(400).json({
      error: error.message
    });
  }
});

app.post("/aspects/batch", (request, response) => {
  try {
    const { points } = request.body;

    if (!points) {
      return response.status(400).json({
        error: "points is required."
      });
    }

    const result = identifyBatchAspects(points);

    response.json(result);
  } catch (error) {
    response.status(400).json({
      error: error.message
    });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`motor-aspects API running on port ${port}`);
});
