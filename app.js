const express = require("express");
const dotenv = require("dotenv");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

dotenv.config({path:'./config.env'});
const PORT = process.env.PORT || 5000;

// dabatase file 
require('./db/conn');

app.use(express.json());
//router path
app.use(require('./router/auth'));
app.use('/',(req,res)=>{
    return res.status(200).json('Server running!!')
})
app.listen(PORT,()=>{
    console.log(`Server started at port ${PORT}`);
});
