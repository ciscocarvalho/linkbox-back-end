const express = require('express')
const router = express.Router()
const usersRoutes = require('./UserRoute')
const dashboardRoutes = require('./DashboardRoute')
const folderRoutes = require('./FolderRoute')
const linkRoutes = require('./LinkRoute')
const authRoutes = require('./AuthRoute')


router.use('/users', usersRoutes)
router.use('/auth', authRoutes)
router.use('/dashboards', dashboardRoutes)
router.use('/folders', folderRoutes)
router.use('/links', linkRoutes)


module.exports = router