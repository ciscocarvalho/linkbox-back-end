import { Connection, connect, connection } from "mongoose";

const mongoURL = process.env.DB_URL;

async function connectToMongoDB(): Promise<Connection> {
  try {
    await connect(mongoURL);

    console.log("Conexão com o MongoDB estabelecida com sucesso.");

    return connection;
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    throw error;
  }
}

export default connectToMongoDB;
