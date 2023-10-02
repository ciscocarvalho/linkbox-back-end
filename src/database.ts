import { Connection } from "mongoose"

const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')


const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD
const DATABASE_USER = process.env.DATABASE_USER
const PORT = process.env.PORT || 3000;

const mongoURL = `mongodb+srv://${DATABASE_USER}:${DATABASE_PASSWORD}@cluster0.03spr09.mongodb.net/?retryWrites=true&w=majority&appName=AtlasAppre`;


const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};


async function connectToMongoDB(): Promise<Connection> {
  try {
    // Conectar ao MongoDB
    const connection = await mongoose.connect(mongoURL, mongoOptions);

    console.log('Conexão com o MongoDB estabelecida com sucesso.');

    return connection;
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    throw error;
  }
}

export default connectToMongoDB;

