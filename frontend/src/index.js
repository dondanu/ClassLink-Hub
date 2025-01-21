// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home'; // Home Page
import Login from './components/Login'; // Login Page
import TeacherView from './components/TeacherView'; // Teacher View
import StudentView from './components/StudentView'; // Student View

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home Page */}
        <Route path="/login" element={<Login />} /> {/* Login Page */}
        <Route path="/teacher" element={<TeacherView />} /> {/* Teacher View */}
        <Route path="/student" element={<StudentView />} /> {/* Student View */}
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
