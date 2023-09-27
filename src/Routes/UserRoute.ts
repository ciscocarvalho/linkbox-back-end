
const express = require('express')

import UserController from '../controller/UserController';
import { checkToken } from '../util/validation';

const router = express.Router();

//router.post('/', UserController.post);

router.get('/', UserController.getAll);

router.get('/:id',checkToken, UserController.getById);

router.put('/:id', UserController.put);

router.delete('/:id', UserController.delete);

module.exports = router
