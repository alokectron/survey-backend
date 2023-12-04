import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { jwtSecretKey } from "../connection";
export async function verifyToken(req: Request, res: Response, next: any) {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    jwt.verify(token.toString(), jwtSecretKey, (err, valid) => {
      if (err) res.status(403).send("Unauthorized request");
      else next();
    });
  } else res.status(403).send("Unauthorized request");
}
