import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Pages.css';

export const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [profileType, setProfileType] = useState('');

  useEffect(() => {
    // Fetch the user data based on the userId
    const fetchUser = async () => {
      try {
        // Replace this with your own logic to fetch the user data
        const response = await fetch(`http://localhost:8088/users?id=${userId}`);
        const userData = await response.json();
        setUser(userData);

        if (userData.isStaff) {
          const employeeResponse = await fetch(`http://localhost:8088/employees?userId=${userId}`);
          const employeeData = await employeeResponse.json();
          setProfileType('employee');
          setUser(prevUser => ({ ...prevUser, ...employeeData }));
        } else {
          const customerResponse = await fetch(`http://localhost:8088/customers?userId=${userId}`);
          const customerData = await customerResponse.json();
          setProfileType('customer');
          setUser(prevUser => ({ ...prevUser, ...customerData }));
        }
      } catch (error) {
        console.error('An error occurred while fetching user:', error);
      }
    };

    fetchUser();
  }, [userId]);

  const handleLogout = () => {
    // Clear user session or perform any other logout logic
    localStorage.removeItem('gg_user');

    // Show the "Goodbye!" alert
    alert('Goodbye!');

    // Redirect the user back to the home page
    window.location.href = '/';
  };

  const renderEmployeeProfile = () => {
    // Render the employee profile using the user data

    return (
      <div className="profile-details">
        <h2>Employee Profile</h2>
        <p>
          Name: {user.fullName}
          <br />
          Store Assignment: {user.storeId}
          <br />
          Start Date: {user.startDate}
          <br />
          Pay Rate: {user.payRate}
          <br />
          Phone Number: {user.phone}
          <br />
          Email Address: {user.email}
        </p>
        <button>Edit / Save</button>
        <button>Delete</button>
      </div>
    );
  };

  const renderCustomerProfile = () => {
    // Render the customer profile using the user data

    return (
      <div className="profile-details">
        <h2>Customer Profile</h2>
        <p>
          Name: {user.fullName}
          <br />
          Loyalty Number: {user.loyaltyNumber}
          <br />
          Phone Number: {user.phone}
          <br />
          Email Address: {user.email}
        </p>
        <button>Edit / Save</button>
        <button>Delete</button>
      </div>
    );
  };

  return (
    <div className="profile-container">
      {user && (
        <React.Fragment>
          {profileType === 'employee' ? renderEmployeeProfile() : renderCustomerProfile()}
          <button onClick={handleLogout}>Logout</button>
        </React.Fragment>
      )}
    </div>
  );
};
