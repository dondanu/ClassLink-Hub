// src/Home.js
import React from 'react';
import { Button, Container, Typography, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom'; // import Link from react-router-dom

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Card sx={{ marginTop: 3, padding: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Welcome to ClassLink Hub
          </Typography>

          <Typography variant="body1" gutterBottom>
            Select the view you want to access:
          </Typography>

          {/* Link to navigate to Teacher View */}
          {/* Link to navigate to Login Page for Teacher View */}
          
                <Link to="/login">
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    sx={{ marginBottom: 2 }}
                  >
                    Teacher View
                  </Button>
                </Link>


          {/* Link to navigate to Student View */}
          <Link to="/student">
            <Button 
              variant="contained" 
              color="secondary" 
              fullWidth
            >
              Student View
            </Button>
          </Link>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Home;
