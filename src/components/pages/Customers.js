import React, { useEffect, useState } from 'react';
import './Pages.css';

export const Customers = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState([])
  const [customers, setCustomers] = useState([]);
  const [editedUser, setEditedUser] = useState(null);
  const [editedCustomer, setEditedCustomer] = useState(null);
  const [updatedFullName, setUpdatedFullName] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedPhone, setUpdatedPhone] = useState('');
  const [updatedAddress, setUpdatedAddress] = useState('');
  const [updatedLoyaltyNumber, setUpdatedLoyaltyNumber] = useState('');

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
        const response = await fetch('http://localhost:8088/customers?_expand=user');
        const data = await response.json();

        // Separate users and customers data
        const usersData = data.map((item) => item.user);
        const customersData = data.map((item) => ({
          ...item,
          user: undefined, // Remove user data from customers array
        }));

        setUsers(usersData);
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

  const handleDelete = async (customerId, userId) => {
    try {
      // Delete the customer from the /customers endpoint
      await fetch(`http://localhost:8088/customers/${customerId}`, {
        method: 'DELETE',
      });

      // Delete the corresponding user from the /users endpoint
      await fetch(`http://localhost:8088/users/${userId}`, {
        method: 'DELETE',
      });

      // Remove the deleted customer from the state
      const updatedCustomers = customers.filter((customer) => customer.id !== customerId);
      setCustomers(updatedCustomers);

      // Remove the deleted user from the state
      const updatedUsers = users.filter((user) => user.id !== userId);
      setUsers(updatedUsers);

      window.alert('Customer deleted!');
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const isEmployee = user?.isStaff;

  return (
    <div>
      {isEmployee && (
        <div className="object-list">
          <h1>Customers</h1>
          {customers.map((customer) => {
            const user = users.find((user) => user.id === customer.userId);

            return (
              <div key={customer.id} className="object-item">
                <div className="object-details">
                  <h2>{user.fullName}</h2>
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
                  {isEmployee && editedUser && editedUser.id === user.id ? (
                    <div className="edit-object">
                      <input
                        type="text"
                        id="customerName"
                        value={user.fullName}
                        onChange={(e) => setUpdatedFullName(e.target.value)}
                      />
                      <input
                        type="text"
                        id="customerEmail"
                        value={user.email}
                        onChange={(e) => setUpdatedEmail(e.target.value)}
                      />
                      <input
                        type="text"
                        id="customerPhone"
                        value={user.phone}
                        onChange={(e) => setUpdatedPhone(e.target.value)}
                      />
                      <input
                        type="text"
                        id="customerAddress"
                        value={user.streetAddress}
                        onChange={(e) => setUpdatedAddress(e.target.value)}
                      />
                      <input
                        type="text"
                        id="loyaltyNumber"
                        value={customer.loyaltyNumber}
                        onChange={(e) => setUpdatedLoyaltyNumber(e.target.value)}
                      />
                      <button className="action-button" onClick={() => handleSave(user.id)}>
                        Save
                      </button>
                      <button className="action-button" onClick={() => setEditedUser(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button
                        className="action-button"
                        onClick={() => handleEdit(user.id, customer.id)}
                      >
                        View/Edit Details
                      </button>
                      <button
                        className="action-button"
                        onClick={() => handleDelete(customer.id, user.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
};

