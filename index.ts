import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
const sql = require("mssql");

const config = {
  user: "master", // better stored in an app setting such as process.env.DB_USER
  password: "L7_qsNmF-2gj_Vn", // better stored in an app setting such as process.env.DB_PASSWORD
  server: "smarteye-surveys.database.windows.net", // better stored in an app setting such as process.env.DB_SERVER
  port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
  database: "mrkt-srvys-db", // better stored in an app setting such as process.env.DB_NAME
  authentication: {
    type: "default",
  },
  options: {
    encrypt: true,
  },
};
connectAndQuery();
async function connectAndQuery() {
  try {
    await sql.connect(config);
    //     await sql.query(`CREATE TABLE packaging_station(id INT NOT NULL IDENTITY(1, 1), name varchar(500), email varchar(500), question varchar(300), answer varchar(300),date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL);`);
    //     await sql.query( `CREATE TABLE users(id INT NOT NULL IDENTITY(1, 1), username varchar(500), password varchar(300));`);
    // await sql.query(`create table leads (id INT NOT NULL IDENTITY(1, 1), email varchar(400), type varchar(300), lead_date varchar(300), lead_description VARCHAR(2000), meeting_scheduled bit DEFAULT 'FALSE', meeting_date datetimeoffset(7) NULL);`);
  } catch (err: any) {
    console.error(err.message);
  }
}

const corsOptions = {
  origin: "*",
  // credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
const jwtSecretKey = "alokmishra";

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

async function verifyToken(req: Request, res: Response, next: any) {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    jwt.verify(token.toString(), jwtSecretKey, (err, valid) => {
      if (err) res.status(403).send("Unauthorized request");
      else next();
    });
  } else res.status(403).send("Unauthorized request");
}

app.post("/form-data", async (req: Request, res: Response) => {
  const email = req.body.email;
  const name = req.body.name;
  const result =
    await sql.query`SELECT * FROM packaging_station WHERE email = '${email}'`;
  delete req.body.email;
  delete req.body.name;
  for (const key in req.body) {
    if (result.recordset.length == 0) {
      await sql.query(
        `INSERT INTO packaging_station (email, name, question, answer) VALUES ('${email}','${name}','${key}','${req.body[key]}');`
      );
    } else {
      await sql.query(
        `UPDATE packaging_station SET answer='${req.body[key]}' where email = '${email}' and question='${key}';`
      );
    }
  }
  res.send("success");
});

app.get("/form-data", verifyToken, async (req: Request, res: Response) => {
  let rows;

  rows = await sql.query`SELECT * FROM packaging_station`;
  if (req.query.email) {
    rows = await sql.query(
      `SELECT * FROM packaging_station WHERE email = '${req.query.email}'`
    );
  }
  if (req.query.question)
    rows = await sql.query(
      `SELECT * FROM packaging_station WHERE question = '${req.query.question}'`
    );
  if (req.query.question && req.query.answer)
    rows = await sql.query(
      `SELECT * FROM packaging_station WHERE question = '${req.query.question}' and answer = '${req.query.answer}'`
    );
  res.send(rows.recordset);
});

app.post("/users", async (req: Request, res: Response) => {
  const password = req.body.password;
  const username = req.body.username;
  const rows = await sql.query`SELECT * FROM users WHERE email = '${username}'`;
  if (rows.recordset.length == 0) {
    await sql.query(
      `INSERT INTO users (username,password) VALUES ('${username}','${password}');`
    );
  } else {
    await sql.query(
      `UPDATE users SET password='${password}' where username = '${username}';`
    );
  }
  res.send("success");
});

app.post("/login", async (req: Request, res: Response) => {
  let rows = await sql.query(
    `SELECT * FROM users WHERE username = '${req.body.username}' AND password = '${req.body.password}'`
  );
  if (rows.recordset.length != 0) {
    jwt.sign(rows, jwtSecretKey, { expiresIn: "24h" }, (err, token) => {
      if (err) {
        res.send("Something went wrong, try again");
      }
      res.send({ user: rows, auth: token });
    });
  } else res.send({ result: "Wrong Credentials" });
});

app.post("/leads", verifyToken, async (req: Request, res: Response) => {
  const inputs = JSON.parse(req.headers.value as string);

  await sql.query(
    `insert into leads(email,type,lead_date,lead_description) values ('${inputs.email}','${inputs.type}','${inputs.lead_date}','${inputs.lead_description}');`
  );
  res.send("success");
});

app.get("/leads", verifyToken, async (req: Request, res: Response) => {
  let rows;
  if (Object.keys(req.query).length == 0)
    rows = await sql.query(`SELECT * FROM leads;`);
  else
    rows = await sql.query(
      `SELECT * FROM leads where email='${req.query.email}' and type='${req.query.type}'`
    );
  res.send(rows.recordset);
});

app.post("/meets", verifyToken, async (req: Request, res: Response) => {
  const inputs = JSON.parse(req.headers.value as string);

  await sql.query(
    `UPDATE leads SET meeting_date = '${inputs.meeting_date}' WHERE email='${inputs.email}' and type='${inputs.type}';`
  );
  res.send("success");
});

app.listen(port);

app.get("/test", async (req: Request, res: Response) => {
  const result = await sql.query`select * from users`;
  console.log(result.recordset);
});
