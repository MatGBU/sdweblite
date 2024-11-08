const express = require('express');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const app = express();
const PORT = 3001;
const csvFilePath = '/Users/mateuszgorczak/Documents/GitHub/Senior-project/Prototype/energy_predictions.csv';

// Serve the HTML file at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/energy-predictions', (req, res) => {
  fs.readFile(csvFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send("Error reading CSV file");
      return;
    }
    const parsedData = Papa.parse(data, { header: true }).data;
    res.json(parsedData);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
