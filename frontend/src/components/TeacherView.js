import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Card, CardContent, Typography, Container, Grid, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const TeacherView = () => {
  const [classes, setClasses] = useState([]); // List of classes
  const [newClass, setNewClass] = useState({ name: '', link: '', time: '' }); // New class data
  const [editingClass, setEditingClass] = useState(null); // Class being edited
  const [editData, setEditData] = useState({ name: '', link: '', time: '' }); // Edited class data
  const [message, setMessage] = useState(''); // Upload message
  const [files, setFiles] = useState([]); // List of uploaded files
  const [file, setFile] = useState(null); // Selected file for upload

  const navigate = useNavigate(); // Use useNavigate hook

  // Fetch classes from backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/classes')
      .then(response => {
        setClasses(response.data); // Set classes to state
      })
      .catch(error => console.error('Error fetching classes:', error));
  }, []);

  // Fetch files from backend
  const fetchFiles = () => {
    axios.get('http://localhost:5000/api/files')
      .then((response) => {
        setFiles(response.data); // Set files in state
      })
      .catch((error) => {
        console.error('Error fetching files:', error);
      });
  };

  // File upload handler
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
    <Container maxWidth="lg">
      <Card sx={{ marginTop: 3, padding: 3 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h4" gutterBottom>
              Teacher's View - Manage Classes
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Back
            </Button>
          </Grid>
        </Grid>

        {/* Class Management Section */}
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

      {/* File Upload Section */}
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

export default TeacherView;
