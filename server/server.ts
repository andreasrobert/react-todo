// const express = require('express');
// const bodyParser = require('body-parser');
import express from 'express';
import path from'path';
import routes from './routes';
import mongoose from 'mongoose';
import cors from'cors';
import dotenv from 'dotenv';

dotenv.config();



const PORT = process.env.PORT || 8000;
const app = express();


mongoose.connect(process.env.dbURL,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, () => {
    console.log("Connected to db!");
    app.listen(PORT,() => {
        console.log(`Server running on port ${PORT}`)
    });
    

})

app.use(cors());
app.set("view engine", "ejs");
app.use('/static', express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/",routes);


