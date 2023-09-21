const expres = require('express')
const router = expres.Router()

const usersRoutes = require('./UserRoute')
router.use('/users', usersRoutes)


module.exports = router