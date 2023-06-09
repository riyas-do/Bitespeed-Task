const express = require("express");
const cors = require('cors');
require('dotenv').config();
const app = express();
const { sequelize } = require('./dbconfig/config');
const { Router } = require("./routes/router")
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(Router);

sequelize.authenticate().then(() => 'database connection successfull').catch(() => 'connection error');

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});