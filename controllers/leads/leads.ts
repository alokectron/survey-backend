import { Request, Response } from "express";
const sql = require("mssql");

export const getLeads = async (req: Request, res: Response) => {
  let rows;
  if (Object.keys(req.query).length == 0)
    rows = await sql.query(`SELECT * FROM leads;`);
  else
    rows = await sql.query(
      `SELECT * FROM leads where email='${req.query.email}' and type='${req.query.type}'`
    );
  res.send(rows.recordset);
};

export const postMeets = async (req: Request, res: Response) => {
  const inputs = JSON.parse(req.headers.value as string);

  await sql.query(
    `UPDATE leads SET meeting_date = '${inputs.meeting_date}' WHERE email='${inputs.email}' and type='${inputs.type}';`
  );
  res.send("success");
};

export const postLeads = async (req: Request, res: Response) => {
  const inputs = JSON.parse(req.headers.value as string);

  await sql.query(
    `insert into leads(email,type,lead_date,lead_description) values ('${inputs.email}','${inputs.type}','${inputs.lead_date}','${inputs.lead_description}');`
  );
  res.send("success");
};
