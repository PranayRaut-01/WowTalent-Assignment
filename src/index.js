const express = require("express");
const route = require('./routes/route.js');
const mongoose = require('mongoose');
const multer = require("multer")
const { AppConfig } = require('aws-sdk');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer().any())


///////////////// [ MONGO-DB CONNECTION ] /////////////////
mongoose.connect("mongodb+srv://PranayR24:LNs6IH7mT8iLlT4b@pranaycluster.2bkjp.mongodb.net/AssignmentWowTalent", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

///////////////// [ ROOT API ] /////////////////
app.use('/', route)

///////////////// [ SERVER CONNECTION ] /////////////////
app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});