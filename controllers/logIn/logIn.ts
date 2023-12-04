const sql = require("mssql");
import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../../connection";
import { Request, Response } from "express";

export const logiIn = async (req: Request, res: Response) => {
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
};
