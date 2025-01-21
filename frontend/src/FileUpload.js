import React, { useState } from 'react';

const FileUpload = () => {
  const [file, setFile] = useState(null);
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

    // கோப்பை backend APIக்கு அனுப்பும்
    fetch('http://localhost:5000/api/upload-note', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch((error) => {
        setMessage('Error uploading file');
      });
  };

  return (
    <div>
      <h3>Upload Class Notes</h3>
      <input type="file" onChange={onFileChange} />
      <button onClick={onFileUpload}>Upload!</button>
      <p>{message}</p>
    </div>
  );
};

export default FileUpload;
