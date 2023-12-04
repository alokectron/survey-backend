import { Request, Response } from "express";
const sql = require("mssql");

export const postForm = async (req: Request, res: Response) => {
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
};

export const getForm = async (req: Request, res: Response) => {
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
};
