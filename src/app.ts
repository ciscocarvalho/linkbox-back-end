import express from 'express';

import routes from './Routes/index';
import cookieParser from 'cookie-parser';

const app = express()
app.use(express.json());
app.use(cookieParser());


app.use('/', routes)

app.get('/', (req, res) => {
  res.status(200).send('<h1 style="text-align: center">Online!</h1>')
})

export default app