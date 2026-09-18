const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory response storage
let responses = [
  {
    id: '1',
    username: 'john_doe',
    email: 'john@example.com',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    device: 'Mobile (iOS)'
  },
  {
    id: '2',
    username: 'alex_smith',
    email: 'alex.smith@example.com',
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    device: 'Desktop (Windows)'
  }
];

// GET /api/responses
app.get('/api/responses', (req, res) => {
  res.json({
    success: true,
    total: responses.length,
    data: responses
  });
});

// POST /api/responses
app.post('/api/responses', (req, res) => {
  const { username, email, password, device } = req.body;

  if (!username) {
    return res.status(400).json({
      success: false,
      error: 'Username field is required.'
    });
  }

  const newResponse = {
    id: Date.now().toString(),
    username: username.trim(),
    email: (email || username).trim(),
    password: password || '',
    timestamp: new Date().toISOString(),
    device: device || 'Web Browser'
  };

  responses.unshift(newResponse);

  res.status(201).json({
    success: true,
    message: 'Data submitted successfully!',
    data: newResponse
  });
});

// DELETE /api/responses/:id
app.delete('/api/responses/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = responses.length;
  responses = responses.filter(item => item.id !== id);

  if (responses.length === initialLength) {
    return res.status(404).json({
      success: false,
      error: 'Record not found.'
    });
  }

  res.json({
    success: true,
    message: 'Record deleted.'
  });
});

// DELETE /api/responses
app.delete('/api/responses', (req, res) => {
  responses = [];
  res.json({
    success: true,
    message: 'All records cleared.'
  });
});

app.listen(PORT, () => {
  console.log(`API Server running at http://localhost:${PORT}`);
});
