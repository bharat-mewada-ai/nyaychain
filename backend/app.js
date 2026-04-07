const express = require('express');

const app = express();

app.get('/test', (req, res) => {
  res.send("TEST OK");
});

app.listen(5000, () => {
  console.log("SERVER STARTED");
});