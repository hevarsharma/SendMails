const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const bodyParser = require('body-parser');

const app = express();

dotenv.config();

const mailRoute = require('./router/nodemailerRouter');

app.use(express.json({limit: '50mb'}));

app.use(express.urlencoded({ extended : true, limit: '50mb'}));

app.use(cors({
  origin: '*'
}));

app.use(bodyParser.json());

app.get('/', async (req, res, next) => {
  res.send({message: 'sendmail is working'});
  next();
})

app.use('/api', mailRoute);


const PORT = process.env.PORT  || 6500;

app.listen( PORT , () => {
    console.log(`server is running on ${PORT}`);
})
