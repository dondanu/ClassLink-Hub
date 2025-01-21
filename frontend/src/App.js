import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Card, CardContent, Typography, Container, Grid, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import './App.css';

// FileUpload Component for uploading notes
const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onFileUpload = () => {
    if (!file) {
      setMessage('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    // Upload file to backend API
    axios.post('http://localhost:5000/api/upload-note', formData)
      .then((response) => {
        setMessage(response.data.message); // Success message
        fetchFiles(); // Refresh file list
      })
      .catch((error) => {
        setMessage('Error uploading file'); // Error message
        console.error('Error uploading file:', error);
      });
  };

  // Fetch all uploaded files from the server
  const fetchFiles = () => {
    axios.get('http://localhost:5000/api/files')
      .then((response) => {
        setFiles(response.data); // Set files in state
      })
      .catch((error) => {
        console.error('Error fetching files:', error);
      });
  };

  // Delete file
  const deleteFile = (filename) => {
    axios.delete(`http://localhost:5000/api/files/${filename}`)
      .then(() => {
        fetchFiles(); // Refresh file list
      })
      .catch((error) => {
        console.error('Error deleting file:', error);
      });
  };

  // Update file (replace with new file)
  const updateFile = (filename) => {
    if (!file) {
      setMessage('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    axios.put(`http://localhost:5000/api/files/${filename}`, formData)
      .then((response) => {
        setMessage('File updated successfully');
        fetchFiles(); // Refresh file list
      })
      .catch((error) => {
        setMessage('Error updating file');
        console.error('Error updating file:', error);
      });
  };

  // Fetch files on component mount
  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <Container maxWidth="md">
      <Card sx={{ marginTop: 3, padding: 2 }}>
        <Typography variant="h5" gutterBottom>
          Upload Class Notes
        </Typography>
        <input type="file" onChange={onFileChange} />
        <Button variant="contained" onClick={onFileUpload} sx={{ marginTop: 2 }}>
          Upload!
        </Button>
        <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
          {message}
        </Typography>

        <Typography variant="h6" sx={{ marginTop: 3 }}>
          Uploaded Files
        </Typography>
        <List>
          {files.map((file, index) => (
            <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <ListItemText primary={file} />
              <div>
                <IconButton onClick={() => deleteFile(file)}>
                  <Delete />
                </IconButton>
                <IconButton onClick={() => updateFile(file)}>
                  <Edit />
                </IconButton>
              </div>
            </ListItem>
          ))}
        </List>
      </Card>
    </Container>
  );
};

function App() {
  const [classes, setClasses] = useState([]); // List of classes
  const [newClass, setNewClass] = useState({ name: '', link: '', time: '' }); // New class data
  const [editingClass, setEditingClass] = useState(null); // Class being edited
  const [editData, setEditData] = useState({ name: '', link: '', time: '' }); // Edited class data
  const [notification, setNotification] = useState(''); // Notification message

  // Fetch classes from backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/classes')
      .then(response => {
        setClasses(response.data); // Set classes to state
      })
      .catch(error => console.error('Error fetching classes:', error));
  }, []);

  // Add new class
  const addClass = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/classes', newClass)
      .then(response => {
        setClasses([...classes, response.data]); // Add new class to list
        setNewClass({ name: '', link: '', time: '' }); // Reset form
      })
      .catch(error => console.error('Error adding class:', error));
  };

  // Countdown Logic & Notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date(); // Get current time in local timezone

      classes.forEach((classItem) => {
        const [hours, minutes] = classItem.time.split(':');
        const classTime = new Date(currentTime); 
        classTime.setHours(hours, minutes, 0, 0); // Set class time for today

        const timeDiff = classTime.getTime() - currentTime.getTime(); // Time difference in milliseconds
        
        // Check if the class time is within 5 minutes from now
        if (timeDiff > 0 && timeDiff <= 5 * 60 * 1000) {
          setNotification(`Class starts in 5 minutes: ${classItem.name}`);

          // Trigger browser notification
          if (Notification.permission === 'granted') {
            new Notification(`Class starts in 5 minutes: ${classItem.name}`);
          }
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, [classes]);

  // Request Notification Permission on Mount
  useEffect(() => {
    if (Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  // Delete class
  const deleteClass = (id) => {
    axios.delete(`http://localhost:5000/api/classes/${id}`)
      .then(() => {
        setClasses(classes.filter((classItem) => classItem.id !== id)); // Remove class from list
      })
      .catch(error => console.error('Error deleting class:', error));
  };

  // Start editing class
  const startEditing = (classItem) => {
    setEditingClass(classItem.id); // Set the class being edited
    setEditData({ name: classItem.name, link: classItem.link, time: classItem.time }); // Set data for form
  };

  // Update class
  const updateClass = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/classes/${editingClass}`, editData)
      .then(response => {
        setClasses(classes.map((classItem) =>
          classItem.id === editingClass ? response.data : classItem
        )); // Update the class in the list
        setEditingClass(null); // Reset editing state
      })
      .catch(error => console.error('Error updating class:', error));
  };

  return (
    <Container maxWidth="lg">
      <Card sx={{ marginTop: 3, padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Live Class Link Hub
        </Typography>
        <Typography variant="body1" gutterBottom>
          Click on a class name to join the live session.
        </Typography>

        {notification && (
          <Typography variant="body2" color="primary" sx={{ marginBottom: 2 }}>
            {notification}
          </Typography>
        )}

        <Grid container spacing={2}>
          {classes.map((classItem) => (
            <Grid item xs={12} md={4} key={classItem.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{classItem.name}</Typography>
                  <Typography variant="body2">{classItem.time}</Typography>
                  <Button variant="outlined" href={classItem.link} target="_blank" fullWidth sx={{ marginTop: 2 }}>
                    Join Now
                  </Button>
                  <div>
                    <Button variant="contained" color="error" onClick={() => deleteClass(classItem.id)} sx={{ marginTop: 2 }}>
                      Delete
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => startEditing(classItem)} sx={{ marginTop: 2 }}>
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {editingClass ? (
          <form onSubmit={updateClass} style={{ marginTop: 3 }}>
            <Typography variant="h5">Update Class</Typography>
            <TextField
              label="Class Name"
              variant="outlined"
              fullWidth
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              required
            />
            <TextField
              label="Class Link"
              variant="outlined"
              fullWidth
              value={editData.link}
              onChange={(e) => setEditData({ ...editData, link: e.target.value })}
              required
              sx={{ marginTop: 2 }}
            />
            <TextField
              label="Class Time"
              variant="outlined"
              fullWidth
              value={editData.time}
              onChange={(e) => setEditData({ ...editData, time: e.target.value })}
              required
              sx={{ marginTop: 2 }}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ marginTop: 2 }}>
              Update Class
            </Button>
          </form>
        ) : (
          <form onSubmit={addClass} style={{ marginTop: 3 }}>
            <Typography variant="h5">Add New Class</Typography>
            <TextField
              label="Class Name"
              variant="outlined"
              fullWidth
              value={newClass.name}
              onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
              required
            />
            <TextField
              label="Class Link"
              variant="outlined"
              fullWidth
              value={newClass.link}
              onChange={(e) => setNewClass({ ...newClass, link: e.target.value })}
              required
              sx={{ marginTop: 2 }}
            />
            <TextField
              label="Class Time"
              variant="outlined"
              fullWidth
              value={newClass.time}
              onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
              required
              sx={{ marginTop: 2 }}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ marginTop: 2 }}>
              Add Class
            </Button>
          </form>
        )}
      </Card>

      {/* File Upload Component */}
      <FileUpload />
    </Container>
  );
}

export default App;
