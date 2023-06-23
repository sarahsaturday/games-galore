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
  const isCustomer = isLoggedIn && !isEmployee;

  const handleEmployeePortalChange = (event) => {
    const selectedPage = event.target.value;
    if (selectedPage) {
      navigate(selectedPage);
    }
  };

  return (
    <header>
      <div className="video-container">
        <video autoPlay muted={true} loop={true} className="header-video">
          <source src="https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/H22QrVJSiphb57vz/videoblocks-a-man-playing-at-home-table-board-game-with-cards-go-chips-and-dice_rzmtzbl_f__3cb9ef96ae25e8175b3a67c0c4badbba__P360.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="logo">
      </div>
      
      <nav className="navigation">
        {isLoggedIn && isEmployee && (
          <div className="dropdown">
            <select id="employeePortal" className="employee-portal" defaultValue="" onChange={handleEmployeePortalChange}>
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
        {(!isLoggedIn && !isEmployee) && (
          <>
            <Link to="/">Home</Link>
            <Link to="/games">Games</Link>
            <Link to="/stores">Stores</Link>
            <Link to="/login">Login/Register</Link>
          </>
        )}
        
        {(isLoggedIn && user) && (
          <>
            <Link to="/">Home</Link>
          </>
        )}

        {(isLoggedIn && isCustomer) && (
          <>
            <Link to="/games">Games</Link>
            <Link to="/stores">Stores</Link>
          </>
        )}

        {(isLoggedIn && user) && (
          <>
            <Link to={`/profile/${user.id}`}>Profile</Link>
          </>
        )}
      </nav>
    </header>
  );
};