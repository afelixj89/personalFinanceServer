import "reflect-metadata";
import express, { Express } from "express";
import cors from "cors";
import sequelize from "./sequelize";
import financialRecordRouter from "./routes/financialRecordRoutes";
import chatRouter from "./routes/chatRoutes";
import "dotenv/config";

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

sequelize
  .authenticate()
  .then(() => console.log("CONNECTED TO MYSQL DATABASE!!"))
  .catch((err: Error) =>
    console.error("Failed to Connect to MySQL Database", err)
  );

sequelize
  .sync()
  .then(() => console.log("Database synced"))
  .catch((err: Error) => console.error("Failed to sync database", err));

app.get("/", (req, res) => {
  res.send("Welcome to the Financial Records API");
});

app.use("/financial-record", financialRecordRouter);
app.use("/chat", chatRouter);

app.listen(port, () => {
  console.log(`Server Running on Port ${port}`);
});
