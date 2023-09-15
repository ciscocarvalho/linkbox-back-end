import * as express from "express"
import { router } from "./Routes/index"




const app = express()
app.use(express.json())

app.use("/", router);
app.listen(3000, () => console.log('rodando...'))