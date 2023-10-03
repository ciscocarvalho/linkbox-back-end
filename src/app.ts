import express from 'express';
import connectToMongoDB from './database';
import routes from './Routes/index';
import cookieParser from 'cookie-parser';

const app = express()
app.use(express.json());
app.use(cookieParser());


app.use('/', routes)

async function startServer() {
  try {
    await connectToMongoDB();

  } catch (error) {
    console.error('Erro durante a inicialização da aplicação:', error);
  }
}

startServer()


app.listen(3000, () => {
  console.log(`Servidor rodando na porta 3000....`);
});
