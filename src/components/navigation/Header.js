import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';

export const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  const handleEmployeePortalChange = (event) => {
    const selectedPage = event.target.value;
    if (selectedPage) {
      navigate(selectedPage);
    }
  };

  return (
    <header>
      <div className="logo">
        {/* Games Galore company logo */}
      </div>
      <nav className="navigation">
        {isLoggedIn && isEmployee && (
          <div className="dropdown">
            <select className="employee-portal" defaultValue="" onChange={handleEmployeePortalChange}>
              <option disabled value="">
                Employee Portal
              </option>
              <option value="/games">Manage Games</option>
              <option value="/stores">Manage Stores</option>
              <option value="/customers">Manage Customers</option>
              <option value="/employees">Manage Employees</option>
            </select>
          </div>
        )}
        <Link to="/">Home</Link>
        <Link to="/games">Games</Link>
        <Link to="/stores">Stores</Link>
        {isLoggedIn && user && (
          <Link to={`/profile/${user.id}`}>Profile</Link>
        )}
        {!isLoggedIn && <Link to="/login">Login/Register</Link>}
      </nav>
    </header>
  );
};
