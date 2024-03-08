require("dotenv").config();

const express = require('express');
const cors = require('cors');
const app = express();
const apiRouter = require('./api');
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

module.exports = app;
