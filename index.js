const express = require('express');
const data = require('./data/db.js')
const app = express();

//Middleware
app.use(express.json());


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`))