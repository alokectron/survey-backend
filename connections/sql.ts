import { Client } from "pg";

var client: Client;

function connect_to_db() {
  client = new Client({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "Mafa@3874",
    port: 5432,
  });
  client.connect(function (err: any) {
    if (err) throw err;
  });
}

async function create_table(name: string, columnsWithType: string[]) {
  connect_to_db();
  await client.query(
    `CREATE TABLE IF NOT EXISTS ${name}(${columnsWithType.toString()});`
  );
}

async function get_data(name: string,columns?:string[],whereClauses?:string[]): Promise<any>{

    if(whereClauses?.length==1){

    }

    await client.query(
        `SELECT ${columns ? columns : "*"} FROM ${name} WHERE `
      );
}