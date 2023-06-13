import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

export const Footer = () => {
  return (
    <footer>
      <div className="contact-info">
        <h3>Contact Us</h3>
        <p>Email: example@example.com</p>
        <p>Phone: 123-456-7890</p>
      </div>
      <div className="sitemap">
        <h3>Sitemap</h3>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/games">Games</Link>
          </li>
          <li>
            <Link to="/stores">Stores</Link>
          </li>
          <li>
            <Link to="/search">Search</Link>
          </li>
          {/* Add more links for other pages as needed */}
        </ul>
      </div>
    </footer>
  );
};
