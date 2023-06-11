/*
Contains the email address, phone number, and a sitemap with links to different pages on the site.
*/

import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom"

function Footer() {
  return (
    <footer>
      <nav className="navigation">
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/games">Games</Link>
          </li>
          <li>
            <Link to="/stores">Stores</Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
}

export default Header;
