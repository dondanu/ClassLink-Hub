import React, { useState } from 'react';
import { Button, TextField, Card, CardContent, Typography, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Dummy validation (Replace with real API validation if needed)
    if (username === 'teacher' && password === '12345') {
      navigate('/teacher'); // Navigate to Teacher View
    } else {
      setErrorMessage('Invalid username or password');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #6a11cb, #2575fc)',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            boxShadow: 6,
            borderRadius: 3,
            padding: 3,
            background: 'white',
          }}
        >
          <CardContent>
            {/* Back Button */}
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/')} // Navigate back to Home
              sx={{ marginBottom: 2 }}
            >
              Back
            </Button>

            {/* Title */}
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: '#6a11cb' }}>
              Teacher Login
            </Typography>

            {/* Login Form */}
            <form onSubmit={handleLogin}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ marginBottom: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  background: 'linear-gradient(to right, #6a11cb, #2575fc)',
                  color: 'white',
                }}
              >
                Login
              </Button>
            </form>

            {/* Error Message */}
            {errorMessage && (
              <Typography color="error" sx={{ marginTop: 2, textAlign: 'center' }}>
                {errorMessage}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
