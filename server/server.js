const express = require('express');
const path = require('path');
const fs = require("fs");
const routes = require('./routes');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const cors = require('cors')



const dbURI = "mongodb+srv://robert1:one2three@nodetuts.fx0g8.mongodb.net/TodoList?retryWrites=true&w=majority";

const PORT = process.env.PORT || 8000;
const app = express();


mongoose.connect(dbURI,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, () => {
    console.log("Connected to db!");
    app.listen(PORT,() => {
        console.log(`Server running on port ${PORT}`)
    });
    

})

app.use(cors())
app.set("view engine", "ejs");
app.use('/static', express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// app.use(express.urlencoded({ extended: true }))


app.use("/",routes);


