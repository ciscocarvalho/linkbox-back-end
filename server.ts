import "dotenv/config";
import app from "./src/app";
import connectToMongoDB from "./src/database";

const PORT = process.env.PORT || 3000;

async function startDB() {
  try {
    await connectToMongoDB();
  } catch (error) {
    console.error("Erro durante a inicialização da aplicação:", error);
  }
}

export function startServer() {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}...`);
  });
}

startDB();
startServer();
