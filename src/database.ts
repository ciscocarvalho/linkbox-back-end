import { Connection, connect, connection } from "mongoose";
import { DB_URL } from "./constants";

async function connectToMongoDB(): Promise<Connection> {
  await connect(DB_URL);
  return connection;
}

export default connectToMongoDB;
