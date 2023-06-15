import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

export const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('gg_user'));

    setUser(storedUser);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem('gg_user'));
      setUser(updatedUser);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const isLoggedIn = !!user;
  const isEmployee = isLoggedIn && user?.isStaff;

  return (
    <header>
      <div className="logo">
        {/* Games Galore company logo */}
      </div>
      <nav className="navigation">
        {isLoggedIn && isEmployee && (
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
        )}
        <Link to="/">Home</Link>
        {isLoggedIn && user && (
          <Link to={`/profile/${user.id}`}>Profile</Link>
        )}
        {!isLoggedIn && <Link to="/login">Login/Register</Link>}
      </nav>
    </header>
  );
};
