const express = require('express');
const app = express();
const mongoose = require('mongoose');




app.listen(3000, 'localhost', () => {
  console.log('app started');
});