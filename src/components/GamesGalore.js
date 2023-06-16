import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Footer } from './navigation/Footer';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Header } from './navigation/Header';
import { Games } from './pages/Games'
import { Customers } from './pages/Customers'
import { Stores } from './pages/Stores';

export const GamesGalore = () => {
  return (
    <>
    <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/games" element={<Games />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/stores" element={<Stores />} />
      </Routes>
      <Footer />
    </>
  );
};
