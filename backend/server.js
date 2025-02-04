const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
app.use(cors());
app.use(express.json());

// Serve files in the "uploads" directory at the "/uploads" route
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer Setup for file uploading
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Destination folder for file uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
  }
});

const upload = multer({ storage: storage });

// Sample classes data with time
let classes = [
  { id: 1, name: 'Math', link: 'https://zoom.us/j/4242280626', time: '10:00 AM' },
  { id: 2, name: 'Science', link: 'https://zoom.us/j/4242280626', time: '11:30 AM' },
  { id: 3, name: 'History', link: 'https://zoom.us/j/4242280626', time: '02:00 PM' }
];



// API to upload notes
app.post('/api/upload-note', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }
  console.log('Uploaded file:', req.file); // Debug log for uploaded file
  res.status(200).send({ message: 'File uploaded successfully', file: req.file });
});

// API to get all uploaded files
app.get('/api/files', (req, res) => {
  const filesDirectory = 'uploads/';
  fs.readdir(filesDirectory, (err, files) => {
    if (err) {
      return res.status(500).send({ message: 'Error reading files directory' });
    }
    res.json(files); // Return list of files in the uploads directory
  });
});

// API to delete a file
app.delete('/api/files/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join('uploads', filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).send({ message: 'Error deleting file' });
    }
    res.status(204).send(); // No content
  });
});

// API to update a file (upload new file and overwrite existing one)
app.put('/api/files/:filename', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }
  const filename = req.params.filename;
  const oldFilePath = path.join('uploads', filename);

  // Delete the old file
  fs.unlink(oldFilePath, (err) => {
    if (err) {
      return res.status(500).send({ message: 'Error deleting old file' });
    }

    // Send response with the new file details
    res.status(200).send({ message: 'File updated successfully', file: req.file });
  });
});

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
