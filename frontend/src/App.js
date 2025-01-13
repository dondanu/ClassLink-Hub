import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [classes, setClasses] = useState([]); // Class list
  const [newClass, setNewClass] = useState({ name: '', link: '', time: '' }); // New class data
  const [editingClass, setEditingClass] = useState(null); // For editing a class
  const [editData, setEditData] = useState({ name: '', link: '', time: '' }); // Data for update
  const [notification, setNotification] = useState(''); // Notification message

  // Fetch classes from backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/classes')
      .then(response => setClasses(response.data))
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

  // Countdown Logic & Notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date(); // Get current time in local timezone
      classes.forEach((classItem) => {
        const [hours, minutes] = classItem.time.split(':');
        const classTime = new Date(currentTime);
        classTime.setHours(hours, minutes, 0, 0); // Set class time on today's date

        const timeDiff = classTime.getTime() - currentTime.getTime(); // Get time difference in milliseconds
        
        if (timeDiff > 0 && timeDiff <= 5 * 60 * 1000) { // Check if class starts within 5 minutes
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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Live Class Link Hub</h1>
        <p>Click on a class name to join the live session.</p>

        {notification && <div className="notification">{notification}</div>}

        <ul>
          {classes.map(classItem => (
            <li key={classItem.id}>
              <a href={classItem.link} target="_blank" rel="noopener noreferrer">
                {classItem.name} - {classItem.time}
              </a>
              <button onClick={() => deleteClass(classItem.id)}>Delete</button>
              <button onClick={() => startEditing(classItem)}>Update</button>
            </li>
          ))}
        </ul>

        {editingClass ? (
          <form onSubmit={updateClass}>
            <h2>Update Class</h2>
            <input
              type="text"
              placeholder="Class Name"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              required
            />
            <input
              type="url"
              placeholder="Class Link"
              value={editData.link}
              onChange={(e) => setEditData({ ...editData, link: e.target.value })}
              required
            />
            <input
              type="time"
              placeholder="Class Time"
              value={editData.time}
              onChange={(e) => setEditData({ ...editData, time: e.target.value })}
              required
            />
            <button type="submit">Update Class</button>
          </form>
        ) : (
          <form onSubmit={addClass}>
            <h2>Add New Class</h2>
            <input
              type="text"
              placeholder="Class Name"
              value={newClass.name}
              onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
              required
            />
            <input
              type="url"
              placeholder="Class Link"
              value={newClass.link}
              onChange={(e) => setNewClass({ ...newClass, link: e.target.value })}
              required
            />
            <input
              type="time"
              placeholder="Class Time"
              value={newClass.time}
              onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
              required
            />
            <button type="submit">Add Class</button>
          </form>
        )}
      </header>
    </div>
  );
}

export default App;
