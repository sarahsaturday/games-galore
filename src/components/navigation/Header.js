import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve the user object from local storage
    const storedUser = JSON.parse(localStorage.getItem('gg_user'));

    // Set the user object in the state
    setUser(storedUser);
  }, []);

  const isLoggedIn = !!user;
  const isEmployee = isLoggedIn && user?.staff;

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
        {isLoggedIn && (
          <React.Fragment>
            <Link to={`/profile/${user.id}`}>Profile</Link>
          </React.Fragment>
        )}
        {!isLoggedIn && <Link to="/login">Login/Register</Link>}
      </nav>
    </header>
  );
};
