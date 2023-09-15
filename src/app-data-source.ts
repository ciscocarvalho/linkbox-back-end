import { DataSource } from "typeorm"
const dotenv = require('dotenv');
dotenv.config();

const porta: any = process.env.PORT;
const host: string = process.env.HOST
const database: string = process.env.DATABASE

export const myDataSource = new DataSource({
    type: "mongodb",
    host: host,
    port: porta,
    database: database,
})
