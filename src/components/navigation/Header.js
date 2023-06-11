import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom"
import "./Header.css"

export const Header = () => {
  return (
    <header>
      <div className="logo">
        {/* Games Galore company logo */}
      </div>
      <nav className="navigation">
        <div className="dropdown">
        <select className="employee-portal" defaultValue="">
            <option disabled value="">
              Employee Portal
            </option>
            <option value="/games">Manage Products</option>
            <option value="/stores">Manage Stores</option>
            <option value="/customers">Manage Customers</option>
            <option value="/employees">Manage Employees</option>
          </select>
        </div>
        <Link to="/">Home</Link>
        <Link to="/login">Login/Register</Link>
      </nav>
    </header>
  );
};
