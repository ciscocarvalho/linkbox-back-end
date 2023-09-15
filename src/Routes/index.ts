const express = require('express')
const router = express.Router()
import { myDataSource } from "../app-data-source"


myDataSource
    .initialize()
    .then(() => {
        console.log("A conexeção foi feita com sucesso pogg")
    })
    .catch((err) => {
        console.error("Erro ao iniciar:", err)
    })

    
    const userRoutes = require('./userRoutes')
    const linkRoutes = require('./LinkRoutes')
    const folderRoutes = require('./FolderRoutes')

    router.use('/users', userRoutes)
    router.use('/links', linkRoutes)
    router.use('/folders', folderRoutes)
    
    
    export { myDataSource, router }

