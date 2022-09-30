const express = require('express');
// import express from 'express';
const app = express();
// import cors from 'cors'
const cors = require('cors');
// import router from './routes/routes.js'
const router = require('./routes/routes');

app.use(express.json());
app.use(cors({origin: true, credentials: true}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use('/', router);
const port = process.env.PORT || 7000
app.listen(port, ()=>console.log(`Server listening on port ${port}`));