import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, Typography, Container, Grid, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const StudentView = () => {
  const [classes, setClasses] = useState([]); // List of classes
  const [files, setFiles] = useState([]); // List of uploaded files
  const navigate = useNavigate(); // Use useNavigate hook

  // Fetch classes from backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/classes')
      .then((response) => {
        setClasses(response.data); // Set classes to state
      })
      .catch((error) => console.error('Error fetching classes:', error));
  }, []);

  // Fetch files from backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/files')
      .then((response) => {
        setFiles(response.data); // Set files to state
      })
      .catch((error) => console.error('Error fetching files:', error));
  }, []);

  return (
    <Container maxWidth="lg">
      <Card sx={{ marginTop: 3, padding: 3 }}>
        {/* Heading */}
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h4" gutterBottom>
              Student's View - Class Details & Notes
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Back
            </Button>
          </Grid>
        </Grid>

        {/* Class Details Section */}
        <Typography variant="h5" gutterBottom>
          Class Details
        </Typography>
        <Grid container spacing={2}>
          {classes.map((classItem) => (
            <Grid item xs={12} md={4} key={classItem.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{classItem.name}</Typography>
                  <Typography variant="body2">{classItem.time}</Typography>
                  <Button
                    variant="outlined"
                    href={classItem.link}
                    target="_blank"
                    fullWidth
                    sx={{ marginTop: 2 }}
                  >
                    Join Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* Uploaded Files Section */}
      <Card sx={{ marginTop: 3, padding: 2 }}>
        <Typography variant="h5" gutterBottom>
          Uploaded Class Notes
        </Typography>
        <List>
          {files.map((file, index) => (
            <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <ListItemText primary={file} />
              <Button
                variant="contained"
                color="primary"
                href={`http://localhost:5000/uploads/${file}`} // Adjust the URL based on your backend
                target="_blank"
              >
                Download
              </Button>
            </ListItem>
          ))}
        </List>
      </Card>
    </Container>
  );
};

export default StudentView;
