const express = require('express')
const router = express.Router()
import { myDataSource } from "../app-data-source"


myDataSource
    .initialize()
    .then(() => {
        console.log("A conexeção foi feita com sucesso")
    })
    .catch((err) => {
        console.error("Erro ao iniciar:", err)
    })

    
    const userRoutes = require('./userRoutes')
    const dashboardRoutes = require('./DashboardRoute')
    const folderRoutes = require('./FolderRoutes')
    const linkRoutes = require('./LinkRoutes')


    router.use('/users', userRoutes)
    router.use('/dashboard', dashboardRoutes)
    router.use('/folders', folderRoutes)
    router.use('/links', linkRoutes)
    
    
    export { myDataSource, router }

