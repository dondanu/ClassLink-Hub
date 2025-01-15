const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Sample classes data with time
let classes = [
  { id: 1, name: 'Math ', link: 'https://zoom.us/j/123456789', time: '10:00 AM' },
  { id: 2, name: 'Science Class', link: 'https://zoom.us/j/987654321', time: '11:30 AM' },
  { id: 3, name: 'History Class', link: 'https://zoom.us/j/456789123', time: '02:00 PM' }
];

// API to get all classes
app.get('/api/classes', (req, res) => {
  res.json(classes);
});

// API to add a class
app.post('/api/classes', (req, res) => {
  const newClass = { id: classes.length + 1, ...req.body };
  classes.push(newClass);
  res.json(newClass);
});

// API to delete a class
app.delete('/api/classes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  classes = classes.filter((classItem) => classItem.id !== id);
  res.status(204).send(); // No content
});

// API to update a class
app.put('/api/classes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = classes.findIndex((classItem) => classItem.id === id);
  if (index !== -1) {
    classes[index] = { id, ...req.body };
    res.json(classes[index]);
  } else {
    res.status(404).send({ error: 'Class not found' });
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
