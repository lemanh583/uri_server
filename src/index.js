require("dotenv").config();
const express = require("express");
const router = require("./router");
const cors = require("cors")
const fileUpload = require("express-fileupload");
// const seeder = require("./config/seeder");
const connectDB = require("./config/connect.db")
const app = express();
const path = require('path')

app.use(cors());
app.use(express.json());
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : 'src/tmp/'
}));
app.use('/static', express.static(path.join(__dirname, '../public')))

app.use(router);


connectDB();

// insert document
// seeder();


const PORT = process.env.PORT;
app.listen(PORT, console.log(`Server run on ${PORT}`));
