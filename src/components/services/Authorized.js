import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Header } from '../navigation/Header';
import { Login } from '../pages/Login';
import { Profile } from '../pages/Profile';

export const Authorized = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      const response = await fetch(`http://localhost:8088/users?email=${credentials.email}`);
      const foundUsers = await response.json();
      if (foundUsers.length === 1) {
        const user = foundUsers[0];
        setUser(user);
        navigate('/profile'); // Redirect to the profile page after successful login
      } else {
        window.alert("Invalid login");
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <Routes>
      <Header user={user} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/profile" element={<Profile user={user} />} />
      {/* Other routes */}
    </Routes>
  );
};
