import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Pages.css';

export const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedFullName, setUpdatedFullName] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedPhone, setUpdatedPhone] = useState('');
  const [updatedAddress, setUpdatedAddress] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('gg_user'));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`http://localhost:8088/users/${userId}`);
      const userData = await response.json();
      if (userData.id === parseInt(userId)) {
        setUser(userData);
      }
    };

    fetchUser();
  }, [userId]);

  const handleEdit = () => {
    setUpdatedFullName(user.fullName);
    setUpdatedEmail(user.email);
    setUpdatedPhone(user.phone);
    setUpdatedAddress(user.streetAddress);
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    try {
      const updatedUser = {
        ...user,
        fullName: updatedFullName,
        email: updatedEmail,
        phone: updatedPhone,
        streetAddress: updatedAddress,
      };

      // Update the user in the "users" array
      await fetch(`http://localhost:8088/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      // Show the "Changes saved!" alert
      alert('Changes saved!');

      // Reset the profile to show the updated details
      setUser(updatedUser);
      setIsEditing(false);

    } catch (error) {
      console.error('An error occurred while updating user:', error);
      // Display an error message or perform any other desired error handling
    }
  };

  const handleDelete = async () => {
    try {
      // Delete the user profile
      await fetch(`http://localhost:8088/users/${userId}`, {
        method: 'DELETE',
      });

      // Clear user session or perform any other logout logic
      localStorage.removeItem('gg_user');

      // Show the "Profile deleted!" message
      alert('Profile deleted!');
      setIsEditing(false);
      // Redirect the user back to the home page
      window.location.href = '/';
    } catch (error) {
      console.error('An error occurred while deleting the user:', error);
      // Display an error message or perform any other desired error handling
    }
  };

  const handleLogout = () => {
    // Clear user session or perform any other logout logic
    localStorage.removeItem('gg_user');

    // Show the "Goodbye!" alert
    alert('Goodbye!');

    // Redirect the user back to the home page
    window.location.href = '/';
  };

  const renderProfileDetails = () => {
    if (user !== null) {
      return (
        <div>
          <h1 className="h1-header">Profile</h1>
          <p>
            Name: {user.fullName} <br />
            Email Address: {user.email} <br />
            Phone Number: {user.phone} <br />
            Street Address: {user.streetAddress} <br />
            {user.isStaff && <span>Staff: Yes</span>}
            {user.isManager && <span>Manager: Yes</span>}
          </p>

          {isEditing && (
            <div className="form-details">
              <input
                type="text"
                id="fullName"
                value={updatedFullName}
                onChange={(e) => setUpdatedFullName(e.target.value)}
              />
              <input
                type="text"
                id="email"
                value={updatedEmail}
                onChange={(e) => setUpdatedEmail(e.target.value)}
              />
              <input
                type="text"
                id="phone"
                value={updatedPhone}
                onChange={(e) => setUpdatedPhone(e.target.value)}
              />
              <input
                type="text"
                id="address"
                value={updatedAddress}
                onChange={(e) => setUpdatedAddress(e.target.value)}
              />
              <div>
                <button className="action-button" onClick={handleSaveChanges}>
                  Save Changes
                </button>
                <button className="action-button" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="profile-form-container">
      {renderProfileDetails()}

      {!isEditing && (
        
          <div>
            <button className="action-button" onClick={handleEdit}>
              View/Edit Details
            </button>
            <button className="action-button" onClick={handleDelete}>
              Delete Profile
            </button>
          </div>
        
      )}
      <p>
        <a href="#" className="logout-link" onClick={handleLogout}>
          Logout
        </a>
      </p>
    </div>
  );
};

