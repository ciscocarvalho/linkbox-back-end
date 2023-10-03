import express from 'express'
const router = express.Router()
import usersRoutes from './UserRoute'
import dashboardRoutes from './DashboardRoute'
import folderRoutes from './FolderRoute'
import linkRoutes from './LinkRoute'
import authRoutes from './AuthRoute'


router.use('/users', usersRoutes)
router.use('/auth', authRoutes)
router.use('/dashboards', dashboardRoutes)
router.use('/folders', folderRoutes)
router.use('/links', linkRoutes)

export default router