import "dotenv/config";
import app from "./src/app";
import connectToMongoDB from "./src/database";

async function startDB() {
  try {
    await connectToMongoDB();
  } catch (error) {
    console.error("Erro durante a inicialização da aplicação:", error);
  }
}

export function startServer() {
  app.listen(3000, () => {
    console.log(`Servidor rodando na porta 3000.....`);
  });
}

startDB();
startServer();
