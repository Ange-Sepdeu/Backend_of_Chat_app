// import express from 'express';
const express = require('express')
const route = express.Router();
// import {register, activateAccount, updateSelf, friendRequest} from '../controllers/controllers.js'
const {register, activateAccount, updateSelf, getFriends, Login} = require('../controllers/controllers');

route.post('/register', register);
route.post('/activate/:email/:name/:password', activateAccount);
route.post('/updateSelf/:name/:email', updateSelf);
// route.post('/friendRequest', friendRequest);
route.get('/getFriends/:email', getFriends);
route.post('/login', Login);

module.exports = route