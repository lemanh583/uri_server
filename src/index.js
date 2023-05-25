require("dotenv").config();
const express = require("express");
const router = require("./router");
const cors = require("cors")
const fileUpload = require("express-fileupload");
// const seeder = require("./config/seeder");
const connectDB = require("./config/connect.db")
const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : 'src/tmp/'
}));

// app.locals.cache = cache
// app.set('cache1', cache)
app.use(router);

// app.set('cache', cache)

// const server = require('http').createServer(app)
// const socketCtr =  require("./controller/socket")

// connect DB
connectDB();

// insert document
// seeder();


const PORT = process.env.PORT;
app.listen(PORT, console.log(`Server run on ${PORT}`));
