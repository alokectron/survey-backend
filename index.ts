import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { verifyToken } from "./middleware/verifyLogin";
import { getForm, postForm } from "./controllers/formData/formData";
import { connectAndQuery, corsOptions } from "./connection";
import { logiIn } from "./controllers/logIn/logIn";
import { getLeads, postLeads, postMeets } from "./controllers/leads/leads";

connectAndQuery();

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

const port = 7300;

app.post("/form", postForm);

app.get("/form", verifyToken, getForm);

app.post("/login", logiIn);

app.post("/leads", verifyToken, postLeads);

app.get("/leads",  getLeads);

app.post("/meets", verifyToken, postMeets);

app.listen(port);
