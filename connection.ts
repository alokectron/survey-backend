const sql = require("mssql");

export const config = {
  user: "master",
  password: "L7_qsNmF-2gj_Vn",
  server: "smarteye-surveys.database.windows.net",
  port: 1433,
  database: "mrkt-srvys-db",
  authentication: {
    type: "default",
  },
  options: {
    encrypt: true,
  },
};

export async function connectAndQuery() {
  try {
    await sql.connect(config);
    //     await sql.query(`CREATE TABLE packaging_station(id INT NOT NULL IDENTITY(1, 1), name varchar(500), email varchar(500), question varchar(300), answer varchar(300),date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL);`);
    //     await sql.query( `CREATE TABLE users(id INT NOT NULL IDENTITY(1, 1), username varchar(500), password varchar(300));`);
    // await sql.query(`create table leads (id INT NOT NULL IDENTITY(1, 1), email varchar(400), type varchar(300), lead_date varchar(300), lead_description VARCHAR(2000), meeting_scheduled bit DEFAULT 'FALSE', meeting_date datetimeoffset(7) NULL);`);
  } catch (err: any) {
    console.error(err.message);
  }
}

export const jwtSecretKey = "alokmishra";

export const corsOptions = {
  origin: "*",
  // credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};