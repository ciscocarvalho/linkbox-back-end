const express = require('express')
const router = express.Router()


import AuthController from "../controller/AuthController"

router.post('/signup', AuthController.signup)


router.post('/signin',AuthController.signin)

module.exports = router


