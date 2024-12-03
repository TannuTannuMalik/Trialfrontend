const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let quizzes = [
  { id: '1', name: 'Science Quiz', category: 'Science', difficulty: 'medium', startDate: '2024-12-01', endDate: '2024-12-15' },
  { id: '2', name: 'Math Quiz', category: 'Math', difficulty: 'easy', startDate: '2024-11-01', endDate: '2024-11-10' },
];

// Route to fetch all quizzes
app.get('/api/quizzes', (req, res) => {
  res.json(quizzes);
});

// Start the server
app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});
