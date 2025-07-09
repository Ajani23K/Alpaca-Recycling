const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors());


app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, backend is working!');
});

app.use(express.static(path.join(__dirname, 'public')));

app.post('/submit-item', (req, res) => {
  const { item, category } = req.body;
  console.log(`Received item: ${item} (Category: ${category})`);
  res.send(`Received "${item}" in category "${category}"`);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

