const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv');
const cors = require('cors');

const bodyParser = require('body-parser');

const app = express();

dotenv.config();

const mailRoute = require('./router/nodemailerRouter');

app.use(express.urlencoded({ extended : true}));

app.use(cors({
  origin: '*'
}));

app.use(bodyParser.json());

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'files');
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString() + '-' + file.originalname);
    }
  });

app.use(multer({ storage : fileStorage }).single('file'));

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

app.use('/api', mailRoute);


const PORT = process.env.PORT;

app.listen( PORT , () => {
    console.log(`server is running on ${PORT}`);
})
