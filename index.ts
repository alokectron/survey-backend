import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { Client } from "pg";
const client = new Client({
  user: "",
  host: "",
  database: "",
  password: "",
  port: 5432,
});
client.connect(function (err: any) {
  if (err) throw err;
  console.log("Connected!");
});
client.query(`CREATE DATABASE IF NOT EXISTS PSS(id bigint,email varchar(500), question varchar(300), answer varchar(300), query varchar(300));`)
const corsOptions = {
  origin: "*",
  //  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

dotenv.config();

const app: Express = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));
app.use(cors(corsOptions));

const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post("/form-data", (req: Request, res: Response) => {
  console.log(req.query);
  console.log(req.body);
  res.send("success");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
