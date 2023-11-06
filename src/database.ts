import { Connection, connect, connection } from "mongoose";

const mongoURL = process.env.DB_URL!;

async function connectToMongoDB(): Promise<Connection> {
  await connect(mongoURL);
  return connection;
}

export default connectToMongoDB;
