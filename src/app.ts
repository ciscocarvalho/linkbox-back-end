const express = require('express')
const databse = require('./database')
const route = require('./routes/UserRoute')

const app = express()
app.use(express.json());

app.use('/user', route)

app.listen(3000, () => {
  console.log(`Servidor rodando na porta 3000`);
});
