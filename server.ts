import "dotenv/config";
import app from "./src/app";
import connectToMongoDB from "./src/database";

const PORT = process.env.PORT || 3000;

async function startDB() {
  await connectToMongoDB();
  console.log("Conexão com o MongoDB estabelecida com sucesso.");
}

export function startServer() {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}...`);
  });
}

startDB();
startServer();
