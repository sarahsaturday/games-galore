import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Header } from './navigation/Header'
import { Footer } from './navigation/Footer'
import { Login } from './pages/Login'
import { Register } from './pages/Register'

export const GamesGalore = () => {
  return (
    <>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
    <Footer />
    </>
  );
};
