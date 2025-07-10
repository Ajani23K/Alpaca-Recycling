require('dotenv').config(); // Load variables from .env
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Hello, backend is working!');
});

app.post('/submit-item', async (req, res) => {
  const { item } = req.body;

  if (!item) {
    return res.status(400).json({ error: 'Item is required' });
  }

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-mnli', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: item,
        parameters: {
          candidate_labels: ['paper', 'plastic', 'metal', 'glass', 'electronic', 'organic', 'other']
        }
      })
    });

    const result = await response.json();

    if (result.error) {
      return res.status(500).json({ error: 'Error from Hugging Face API', details: result });
    }

    const category = result.labels[0];
    const confidence = result.scores[0];

    res.json({
      item,
      category,
      confidence
    });
  } catch (err) {
    console.error('Hugging Face error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
