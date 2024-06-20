import express, { Express } from "express";
import mongoose from "mongoose";
import financialRecordRouter from "./routes/financialRecordRoutes";
import cors from "cors";

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

const mongoURI: string =
  "mongodb+srv://afelixj89:dSox37eYkrCJBVV8@personalfinancetracker.unee92a.mongodb.net/";
mongoose
  .connect(mongoURI)
  .then(() => console.log("CONNECTED TO MONGO DB!!"))
  .catch((err) => console.error("Failed to Connect to Mongo DB", err));

// Define the home route
app.get('/', (req, res) => {
  res.send('Welcome to the Financial Records API');
});

app.use("/financial-record", financialRecordRouter);

app.listen(port, () => {
  console.log(`Server Running on Port ${port}`);
});
