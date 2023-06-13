import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Footer } from './navigation/Footer';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Authorized } from './services/Authorized';
import { Header } from './navigation/Header';

export const GamesGalore = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile/:userId"
          element={<Profile />}
        />
        <Route path="/*" element={<Authorized />} />
      </Routes>
      <Footer />
    </>
  );
};