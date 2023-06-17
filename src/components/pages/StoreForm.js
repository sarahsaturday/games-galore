import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pages.css';

export const StoreForm = ({ nextId }) => {
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [storeHours, setStoreHours] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState([]);
  const [storeAdded, setStoreAdded] = useState(false);

  const handleStoreNameChange = (event) => {
    setStoreName(event.target.value);
  };

  const handleStoreAddressChange = (event) => {
    setStoreAddress(event.target.value);
  };

  const handleStorePhoneChange = (event) => {
    setStorePhone(event.target.value);
  };

  const handleStoreHoursChange = (event) => {
    setStoreHours(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);

    const newStore = {
      id: nextId,
      storeName: storeName,
      storeAddress: storeAddress,
      storePhone: storePhone,
      storeHours: storeHours,
      employeeId: []
    };

    try {
      const response = await fetch('http://localhost:8088/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStore),
      });

      if (response.ok) {
        setIsSubmitting(false);
        navigate('/stores');
        // Display the alert and set storeAdded to true
        window.alert('Store added!');
        setStoreAdded(true);
      } else {
        throw new Error('Error adding store');
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error('Error adding store:', error);
    }
  };

  useEffect(() => {

    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8088/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (storeAdded) {
      setStoreAdded(false); // Reset storeAdded to false
      window.location.reload(); // Reload the page
    }
  }, [storeAdded]);

  return (
    <div className="store-form">
      <h2>Add New Store</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="storeName">Store Name:</label>
          <input
            type="text"
            id="storeName"
            className="store-form-input"
            value={storeName}
            onChange={handleStoreNameChange}
            required
          />
        </div>
        <div>
          <label htmlFor="storeAddress">Store Address:</label>
          <input
            type="text"
            id="storeAddress"
            className="store-form-input"
            placeholder="333 3rd St"
            value={storeAddress}
            onChange={handleStoreAddressChange}
            required
          />
        </div>
        <div>
          <label htmlFor="storePhone">Store Phone:</label>
          <input
            type="text"
            id="storePhone"
            className="store-form-input"
            placeholder="333-333-3333"
            value={storePhone}
            onChange={handleStorePhoneChange}
            required
          />
        </div>
        <div>
          <label htmlFor="storeHours">Store Hours:</label>
          <input
            type="text"
            id="storeHours"
            className="store-form-input"
            placeholder="9:00 AM - 6:00 PM"
            value={storeHours}
            onChange={handleStoreHoursChange}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="store-form-button"
        >
          Add Store
        </button>
      </form>
    </div>
  );
};
