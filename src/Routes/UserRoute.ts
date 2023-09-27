
const express = require('express')

import UserController from '../controller/UserController';

const router = express.Router();

router.post('/', UserController.post);

router.get('/', UserController.getAll);

router.get('/:id', UserController.getById);

router.put('/:id', UserController.put);

router.delete('/:id', UserController.delete);

module.exports = router
