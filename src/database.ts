const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')


const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD
const DATABASE_USER = process.env.DATABASE_USER
const PORT = process.env.PORT || 3000;


mongoose.connect(`mongodb+srv://${DATABASE_USER}:${DATABASE_PASSWORD}@cluster0.03spr09.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB:'));
db.once('open', () => {
  console.log('Conectado Nice!');
});

module.exports = db ;
