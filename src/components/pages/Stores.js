import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Pages.css';

export const Stores = () => {
  const [stores, setStores] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([])
  const [editedStore, setEditedStore] = useState(null);
  const [updatedStoreName, setUpdatedStoreName] = useState('');
  const [updatedAddress, setUpdatedAddress] = useState('');
  const [updatedPhone, setUpdatedPhone] = useState('');
  const [updatedEmployeeIds, setUpdatedEmployeeIds] = useState([]);

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const storesResponse = await fetch('http://localhost:8088/stores');
        const storesData = await storesResponse.json();
        setStores(storesData);

        const usersResponse = await fetch('http://localhost:8088/users');
        const usersData = await usersResponse.json();
        setUsers(usersData);

        const employeesResponse = await fetch('http://localhost:8088/employees');
        const employeesData = await employeesResponse.json();
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (storeId) => {
    const store = stores.find((store) => store.id === storeId);
    setEditedStore(store);
    setUpdatedStoreName(store.storeName);
    setUpdatedAddress(store.storeAddress);
    setUpdatedPhone(store.storePhone);
    setUpdatedEmployeeIds(store.employeeId);
  };

  const handleEmployeeCheckboxChange = (e, employeeId) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      setUpdatedEmployeeIds((prevEmployeeIds) => [...prevEmployeeIds, employeeId]);
    } else {
      setUpdatedEmployeeIds((prevEmployeeIds) => prevEmployeeIds.filter((id) => id !== employeeId));
    }
  };

  const handleSave = async (storeId) => {
    const updatedStore = {
      ...editedStore,
      storeName: updatedStoreName,
      storeAddress: updatedAddress,
      storePhone: updatedPhone,
      employeeId: updatedEmployeeIds,
    };

    try {
      const updatedStores = stores.map((store) => {
        if (store.id === storeId) {
          return updatedStore;
        }
        return store;
      });

      setEditedStore(updatedStore);

      // Send the updated store data to the API
      await fetch(`http://localhost:8088/stores/${storeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedStore),
      });

      // Update the state with the updated data
      setStores(updatedStores);

      window.alert('Changes saved!');
      window.location.reload();
    } catch (error) {
      console.error('Error updating store:', error);
    }
  };

  const handleDelete = async (storeId) => {
    try {
      await fetch(`http://localhost:8088/stores/${storeId}`, {
        method: 'DELETE',
      });

      const updatedStores = stores.filter((store) => store.id !== storeId);
      setStores(updatedStores);

      window.alert('Store deleted!');
    } catch (error) {
      console.error('Error deleting store:', error);
    }
  };

  return (
    <div>
      <h1>Stores</h1>
      {stores.map(({ id, storeName, storeAddress, storePhone, storeHours, employeeId }) => (
        <div key={id}>
          <h2>{storeName}</h2>
          <p>Address: {storeAddress}</p>
          <p>Phone: {storePhone} </p>
          <p>Store Hours: {storeHours} </p>

          {editedStore && editedStore.id === id && (
            <div>
              <input
                type="text"
                placeholder="Enter store name"
                value={updatedStoreName}
                onChange={(e) => setUpdatedStoreName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter store address"
                value={updatedAddress}
                onChange={(e) => setUpdatedAddress(e.target.value)}
              />
              <input
                type="text"
                placeholder="Phone number"
                value={updatedPhone}
                onChange={(e) => setUpdatedPhone(e.target.value)}
              />

<div>
  <p>Employees at this location:</p>
  {employees.map((employee) => {
    const user = users.find((user) => user.id === employee.userId);
    const fullName = user ? user.fullName : '';

    return (
      <label key={employee.id}>
        <input
          type="checkbox"
          value={employee.id}
          checked={updatedEmployeeIds.includes(employee.id)}
          onChange={(e) => handleEmployeeCheckboxChange(e, employee.id)}
        />
        {fullName}
      </label>
    );
  })}
</div>
              <button className="action-button" onClick={() => handleSave(id)}>
                Save
              </button>
              <button className="action-button" onClick={() => setEditedStore(null)}>
                Cancel
              </button>
            </div>
          )}

          {!editedStore && (
            <div>
              <button className="action-button" onClick={() => handleEdit(id)}>
                Edit
              </button>
              <button className="action-button" onClick={() => handleDelete(id)}>
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
