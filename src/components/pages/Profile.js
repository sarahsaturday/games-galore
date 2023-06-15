import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Pages.css';

export const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [profileType, setProfileType] = useState('');
  const [storeName, setStoreName] = useState('');

  useEffect(() => {
    // Fetch the user data based on the userId
    const fetchUser = async () => {
      try {
        // Replace this with your own logic to fetch the user data
        const response = await fetch(`http://localhost:8088/users/${userId}`);
        const userData = await response.json();
        setUser(userData);

        if (userData.isStaff === true) {
          const employeeResponse = await fetch(`http://localhost:8088/employees?userId=${userId}`);
          const employeeData = await employeeResponse.json();
          
          setProfileType('employee');
          setUser(prevUser => ({ ...prevUser, ...employeeData[0] }));

          // Fetch the store data based on the storeId
          const storeResponse = await fetch(`http://localhost:8088/stores/${employeeData[0].storeId}`);
          const storeData = await storeResponse.json();
          setStoreName(storeData.storeName);

        } else {
          const customerResponse = await fetch(`http://localhost:8088/customers?userId=${userId}`);
          const customerData = await customerResponse.json();
          setProfileType('customer');
          setUser(prevUser => ({ ...prevUser, ...customerData[0] }));
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
    if (user && profileType === 'employee') {

      const formattedPayRate = user.payRate ? `$${user.payRate.toFixed(2)} per hour` : '';

      return (
        <div className="profile-details">
          <h2>Employee Profile</h2>
          <p>
            Name: {user.fullName}
            <br />
            Store Assignment: {storeName}
            <br />
            Start Date: {user.startDate}
            <br />
            Pay Rate: {formattedPayRate}
            <br />
            Phone Number: {user.phone}
            <br />
            Email Address: {user.email}
          </p>
          <div className="button-container">
  <button className="action-button">Edit</button>
  <button className="action-button">Save</button>
  <button className="action-button">Delete Account</button>
</div>
        </div>
      );
    }
    return null;
  };

  const renderCustomerProfile = () => {
    if (user && profileType === 'customer') {
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
          <div className="button-container">
  <button className="action-button">Edit</button>
  <button className="action-button">Save</button>
  <button className="action-button">Delete Account</button>
</div>
        </div>
      );
    }
    return null;
  };


  return (
    <div className="profile-container">
      {renderEmployeeProfile() || renderCustomerProfile()}
      <p><a href="#" className="logout-link" onClick={handleLogout}>Logout</a></p>
  </div>
  );
};