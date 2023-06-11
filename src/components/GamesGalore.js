import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Header } from './navigation/Header'

export const GamesGalore = () => {
  return (
    <>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
    </>
  );
};
