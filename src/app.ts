const expres = require('express')
const databse = require('./database')
const routes = require('./routes')

const app = expres()
app.use(expres.json());

app.use('/', routes)

app.listen(3200 || 3000, () => {
  console.log(`Servidor rodando na porta 3100...`);
});

