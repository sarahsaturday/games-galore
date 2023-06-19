import React, { useEffect, useState } from 'react';
import { StoreForm } from './StoreForm';
import './Pages.css';

export const Stores = () => {
  const [stores, setStores] = useState([]);
  const [user, setUser] = useState([])
  const [games, setGames] = useState([])
  const [editedStore, setEditedStore] = useState(null);
  const [updatedStoreName, setUpdatedStoreName] = useState('');
  const [updatedAddress, setUpdatedAddress] = useState('');
  const [updatedPhone, setUpdatedPhone] = useState('');
  const [nextId, setNextId] = useState(0);
  const [updatedHours, setUpdatedHours] = useState('');
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('gg_user'));
    setUser(storedUser);

    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem('gg_user'));
      setUser(updatedUser);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8088/stores');
        const data = await response.json();

        setStores(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:8088/employees');
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
  
    fetchEmployees();
  }, []);

  const handleEdit = (storeId) => {
    const store = stores.find((store) => store.id === storeId);
    setEditedStore(store);
    setUpdatedStoreName(store.storeName);
    setUpdatedAddress(store.storeAddress);
    setUpdatedPhone(store.storePhone);
    setUpdatedHours(store.storeHours)
  };

  const handleSave = async (storeId) => {
    const updatedStore = {
      ...editedStore,
      storeName: updatedStoreName,
      storeAddress: updatedAddress,
      storePhone: updatedPhone,
      storeHours: updatedHours
    };

    try {
      await fetch(`http://localhost:8088/stores/${storeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedStore),
      });

      const updatedStores = stores.map((store) => (store.id === storeId ? updatedStore : store));
      setStores(updatedStores);

      setEditedStore(null);

      window.alert('Changes saved!');
    } catch (error) {
      console.error('Error updating store:', error);
    }
  };

  const handleDelete = async (storeId) => {
    // Filter out any associated employees from the employees state
    const updatedEmployees = employees.filter((employee) => employee.storeId !== storeId);
    setEmployees(updatedEmployees);
  
    // Optional: Notify the user that associated employees were not deleted
  
    try {
      // Delete the store
      await fetch(`http://localhost:8088/stores/${storeId}`, {
        method: 'DELETE',
      });
  
      // Filter out the deleted store from the stores state
      const updatedStores = stores.filter((store) => store.id !== storeId);
      setStores(updatedStores);
  
      // Optional: Notify the user that the store was deleted
  
      window.alert('Store deleted!');
    } catch (error) {
      console.error('Error deleting store:', error);
    }
  };  

  const isEmployee = user?.isStaff;

  return (
    <div>
      {isEmployee && (
        <div>
          <StoreForm nextId={nextId} />
        </div>
      )}

      <div className="object-list">
        <h1>Stores</h1>
        {stores.map(({ id, storeName, storeAddress, storePhone, storeHours }) => (
          <div key={id} className="object-item">
            <div className="object-details">
              <h2>{storeName}</h2>
              <p>Address: {storeAddress}</p>
              <p>Phone: {storePhone}</p>
              <p>Store Hours: {storeHours}</p>
            </div>

            {isEmployee && editedStore && editedStore.id === id && (
              <div className="edit-object">
                <input
                  type="text"
                  id="storeName"
                  value={storeName}
                  onChange={(e) => setUpdatedStoreName(e.target.value)}
                />
                <input
                  type="text"
                  id="storeAddress"
                  value={storeAddress}
                  onChange={(e) => setUpdatedAddress(e.target.value)}
                />
                <input
                  type="text"
                  id="storePhone"
                  value={storePhone}
                  onChange={(e) => setUpdatedPhone(e.target.value)}
                />

                <button className="action-button" onClick={() => handleSave(id)}>
                  Save
                </button>
                <button className="action-button" onClick={() => setEditedStore(null)}>
                  Cancel
                </button>
              </div>
            )}

            {isEmployee && !editedStore && (
              <div>
                <button className="action-button" onClick={() => handleEdit(id)}>
                  View/Edit Details
                </button>
                <button className="action-button" onClick={() => handleDelete(id)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
};