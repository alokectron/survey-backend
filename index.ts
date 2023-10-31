import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { Client } from "pg";
const client = new Client({
  user: "master",
  host: "smarteye-surveys.database.windows.net",
  database: "mrkt-srvys-db",
  password: "L7_qsNmF-2gj_Vn",
  // port: 5433,
});

(async () => {
  client.connect(function (err: any) {
    if (err) throw err;
  });
  await client.query(
    `CREATE TABLE IF NOT EXISTS PSS(id serial not null primary key, name varchar(500), email varchar(500), question varchar(300), answer varchar(300));`
  );
})();

const corsOptions = {
  origin: "*",
  // credentials: true, //access-control-allow-credentials:true
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

app.post("/form-data", async (req: Request, res: Response) => {
  const email = req.body.email;
  const name = req.body.name;
  const { rows } = await client.query(
    `SELECT * FROM PSS WHERE email = '${email}'`
  );
  delete req.body.email;
  delete req.body.name;
  for (const key in req.body) {
    if (rows.length == 0) {
      await client.query(
        `INSERT INTO PSS (email, name, question, answer) VALUES ('${email}','${name}','${key}','${req.body[key]}');`
      );
    } else {
      await client.query(
        `UPDATE PSS SET answer='${req.body[key]}' where email = '${email}' and question='${key}';`
      );
    }
  }
  res.send("success");
});

app.get("/form-data", async (req: Request, res: Response) => {
  let rows;
  ({ rows } = await client.query(`SELECT * FROM PSS`));
  if (req.query.email)
    ({ rows } = await client.query(
      `SELECT * FROM PSS WHERE email = '${req.query.email}'`
    ));
  if (req.query.question)
    ({ rows } = await client.query(
      `SELECT * FROM PSS WHERE question = '${req.query.question}'`
    ));
  if (req.query.question && req.query.answer)
    ({ rows } = await client.query(
      `SELECT * FROM PSS WHERE question = '${req.query.question}' and answer = '${req.query.answer}'`
    ));
  res.send(rows);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
