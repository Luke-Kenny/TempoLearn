import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import quizRouter from "./routes/quiz";
import customNotesRouter from "./routes/customNotes";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/quiz", quizRouter);
app.use("/api/custom-notes", customNotesRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
