const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json({limit: '150mb'}));
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, 'index.html');
  res.sendFile(filePath);
})
app.post('/load', (req, res) => {
  let counter = 0;
  let error = null;
  for(let i = 0; i < req.body.files.length; i++) {
    const filename = +new Date() + '_' + req.body.files[i].name;
    const base64Data = req.body.files[i].src.split(';base64,').pop();// .replace(/^data:image\/png;base64,/, "");

    fs.writeFile('./public/' + filename, base64Data, 'base64', function(err) {
      if (err) return error = err;
      counter++;
      if (counter === req.body.files.length) {
          res.sendStatus(200)
        }
    });
  }
  if (error) res.status(500).send(error);
})

app.listen(3000);