import { Connection, connect } from "mongoose";

const mongoURL = "mongodb://127.0.0.1:27017/person";

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

async function connectToMongoDB(): Promise<Connection> {
  try {
    const connection = await connect(mongoURL, mongoOptions as any);

    console.log("Conexão com o MongoDB estabelecida com sucesso.");

    return connection as any;
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    throw error;
  }
}

export default connectToMongoDB;
