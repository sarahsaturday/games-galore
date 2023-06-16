import React, { useEffect, useState } from 'react';
import './Pages.css';

export const Customers = () => {
  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [editedUser, setEditedUser] = useState(null);
  const [editedCustomer, setEditedCustomer] = useState(null);
  const [updatedFullName, setUpdatedFullName] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedPhone, setUpdatedPhone] = useState('');
  const [updatedAddress, setUpdatedAddress] = useState('');
  const [updatedLoyaltyNumber, setUpdatedLoyaltyNumber] = useState('');

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const usersResponse = await fetch('http://localhost:8088/users');
        const usersData = await usersResponse.json();
        setUsers(usersData);

        const customersResponse = await fetch('http://localhost:8088/customers');
        const customersData = await customersResponse.json();
        setCustomers(customersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (userId, customerId) => {
    const user = users.find((user) => user.id === userId);
    setEditedUser(user);
    setUpdatedFullName(user.fullName);
    setUpdatedEmail(user.email);
    setUpdatedPhone(user.phone);
    setUpdatedAddress(user.streetAddress);

    const customer = customers.find((customer) => customer.id === customerId);
    setEditedCustomer(customer);
    setUpdatedLoyaltyNumber(customer.loyaltyNumber);
  };

  const handleSave = async (userId) => {
    const updatedUser = {
      ...editedUser,
      fullName: updatedFullName,
      email: updatedEmail,
      phone: updatedPhone,
      streetAddress: updatedAddress,
    };

    const updatedCustomer = {
        ...editedCustomer,
        loyaltyNumber: parseInt(updatedLoyaltyNumber),
        userId: userId,
      };

      try {
        // Update the user data
        await fetch(`http://localhost:8088/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUser),
        });
           
            // Update the customer data
      await fetch(`http://localhost:8088/customers/${updatedCustomer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCustomer),
      });

          // Refresh the data
      const updatedUsers = users.map((user) => (user.id === userId ? updatedUser : user));
      setUsers(updatedUsers);

      const updatedCustomers = customers.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      );
      setCustomers(updatedCustomers);

      setEditedUser(null);
      setEditedCustomer(null);

      window.alert('Changes saved!');
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await fetch(`http://localhost:8088/users/${userId}`, {
        method: 'DELETE',
      });

      const updatedUsers = users.filter((user) => user.id !== userId);
      setUsers(updatedUsers);

      // Remove the customer with matching userId from the customers array
      const updatedCustomers = customers.filter((customer) => customer.userId !== userId);
      setCustomers(updatedCustomers);

      window.alert('Customer deleted!');
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  return (
    <div>
      {/* Customer list */}
      {customers.map((customer) => {
        const user = users.find((user) => user.id === customer.userId);

        return (
          <div key={customer.id}>
            <h2>{customer.fullName}</h2>
            {user && (
              <>
                <p>Name: {user.fullName}</p>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone}</p>
                <p>Address: {user.streetAddress}</p>
              </>
            )}
            <p>Loyalty Number: {customer.loyaltyNumber}</p>

            {/* Edit and Delete buttons */}
            {editedUser && editedUser.id === customer.userId ? (
              <div>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={updatedFullName}
                  onChange={(e) => setUpdatedFullName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Enter email"
                  value={updatedEmail}
                  onChange={(e) => setUpdatedEmail(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Enter phone"
                  value={updatedPhone}
                  onChange={(e) => setUpdatedPhone(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Enter address"
                  value={updatedAddress}
                  onChange={(e) => setUpdatedAddress(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Enter loyalty number"
                  value={updatedLoyaltyNumber}
                  onChange={(e) => setUpdatedLoyaltyNumber(e.target.value)}
                />
                <button className="action-button" onClick={() => handleSave(customer.userId)}>
                  Save
                </button>
                <button className="action-button" onClick={() => setEditedUser(null)}>
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <button className="action-button" onClick={() => handleEdit(customer.userId, customer.id)}>
                  Edit
                </button>
                <button className="action-button" onClick={() => handleDelete(customer.userId)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};