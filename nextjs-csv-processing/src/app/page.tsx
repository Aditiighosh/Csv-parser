'use client';
import axios from 'axios';
import React, { useState } from 'react';

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null); // Typed file state
  const [uploadStatus, setUploadStatus] = useState('');
  const [filePath, setFilePath] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [userData, setUserData] = useState({ email: '', identifier: '', firstName: '', lastName: '' });
  const [userAddedMessage, setUserAddedMessage] = useState('');
  const [downloadLink, setDownloadLink] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setFilePath(selectedFile ? `uploads/${selectedFile.name}` : '');
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Upload successful:", res.data, filePath);
      setUploadStatus('Upload successful');
      setShowForm(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Upload error:", error.response ? error.response.data : error.message);
      } else {
        console.error("Upload error:", error);
      }
      setUploadStatus('Upload failed');
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...userData, csvFilePath: filePath };
      const response = await axios.post('/api/addUser', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
      setUserAddedMessage('');
      setTimeout(() => {
        setUserAddedMessage('User added successfully');
      }, 1000);
      setDownloadLink(response.data.downloadLink);
      // Reset the form and user data
      setUserData({ email: '', identifier: '', firstName: '', lastName: '' });
     
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('❌ API error:', error.response?.data || error.message);
      } else {
        console.error('❌ Unexpected error:', error);
      }
      setUserAddedMessage('Failed to add user');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">📂 File Upload</h1>
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4 p-2 border rounded-lg"
      />
      <button
        onClick={handleUpload} // Call handleUpload without arguments
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Upload File
      </button>
      <p className="mt-4 text-green-600">{uploadStatus}</p>

      {showForm && (
        <form onSubmit={handleAddUser} className="mt-4 p-4 border rounded-lg bg-white">
          <h2 className="text-xl font-bold mb-4">Add User Data</h2>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            className="mb-2 p-2 border rounded-lg w-full"
          />
          <input
            type="text"
            name="identifier"
            placeholder="Identifier"
            value={userData.identifier}
            onChange={(e) => setUserData({ ...userData, identifier: e.target.value })}
            className="mb-2 p-2 border rounded-lg w-full"
          />
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={userData.firstName}
            onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
            className="mb-2 p-2 border rounded-lg w-full"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={userData.lastName}
            onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
            className="mb-2 p-2 border rounded-lg w-full"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Add User
          </button>
        </form>
      )}

      {userAddedMessage && (
        <div className="mt-4 p-4 border rounded-lg bg-white">
          <p className="text-green-600">{userAddedMessage}</p>
          {downloadLink && (
            <a href={downloadLink} download className="text-blue-600 hover:underline block mt-2">
              Download Updated file
            </a>
          )}
        </div>
      )}
    </div>
  );
}
