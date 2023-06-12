import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css'

export const Register = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState('customer');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [stores, setStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState('');
    const [startDate, setStartDate] = useState('');
    const [hourlyRate, setHourlyRate] = useState('');
    const [managers, setManagers] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false); // State variable for showing the confirmation modal

    useEffect(() => {
        // Fetch stores from the database
        fetch('http://localhost:8088/stores')
            .then((response) => response.json())
            .then((data) => {
                setStores(data);
                setSelectedStore(data.length > 0 ? data[0].id : '');
            })
            .catch((error) => {
                console.error('Error fetching stores:', error);
            });
    }, []);

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Fetch existing users from the database
        fetch('http://localhost:8088/users')
            .then((response) => response.json())
            .then((users) => {
                // Determine the highest ID
                const highestId = users.reduce((maxId, user) => Math.max(maxId, parseInt(user.id)), 0);

                // Create a new user object with the next ID
                const newUser = {
                    id: (highestId + 1).toString(),
                    fullName,
                    email,
                    phone,
                    homeAddress: address,
                    isStaff: userType === 'employee',
                    isManager: userType === 'employee' && managers,
                };

                // Add the new user to the users database
                fetch('http://localhost:8088/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newUser),
                })
                    .then((response) => response.json())
                    .then((user) => {
                        if (userType === 'employee') {
                            // Create a new employee object
                            const newEmployee = {
                                id: user.id,
                                startDate,
                                hourlyRate,
                            };

                            // Add the new employee to the employees database
                            fetch('http://localhost:8088/employees', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(newEmployee),
                            })
                                .then(() => {
                                    // Update the selected store with the new employee ID
                                    fetch(`http://localhost:8088/stores/${selectedStore}`, {
                                        method: 'PATCH',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            employeeId: newEmployee.id,
                                        }),
                                    })
                                    .then(() => {
                                        // Show the confirmation modal
                                        setShowConfirmation(true);
                                      })
                                      .catch((error) => {
                                        console.error('Error updating store:', error);
                                      });
                                  })
                                  .catch((error) => {
                                    console.error('Error adding employee:', error);
                                  });
                              } else {
                                // Show the confirmation modal
                                setShowConfirmation(true);
                              }
                            })
                            .catch((error) => {
                              console.error('Error adding user:', error);
                            });
                        })
                        .catch((error) => {
                          console.error('Error fetching users:', error);
                        });
                    };
                  
                    const handleCloseConfirmation = () => {
                      setShowConfirmation(false);
                  
                      // Navigate to the profile page
                      navigate('/profile'); // Replace '/profile' with the actual route to the profile page
                    };

    return (
        <div className="register-container">
            <h2>New {userType === 'customer' ? 'Customer' : 'Employee'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    Choose One: <label>
                        <input
                            type="radio"
                            value="customer"
                            checked={userType === 'customer'}
                            onChange={handleUserTypeChange}
                        />
                        I am a Customer&nbsp;
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="employee"
                            checked={userType === 'employee'}
                            onChange={handleUserTypeChange}
                        />
                        I am an Employee
                    </label>
                </div>
                <div>
                    <label>
                        Full Name:&nbsp;
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            placeholder="First Last"
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Email:&nbsp;
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="email@email.com"
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Phone:&nbsp;
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            placeholder="333-333-3333"
                        />
                    </label>
                </div>
                {userType === 'customer' ? (
                    <div>
                        <label>
                            Street Address:&nbsp;
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                placeholder="333 3rd St"
                            />
                        </label>
                    </div>
                ) : (
                    <div>
                        <label>
                            Store:&nbsp;
                            <select
                                value={selectedStore}
                                onChange={(e) => setSelectedStore(e.target.value)}
                                required
                            >
                                {stores.map((store) => (
                                    <option key={store.id} value={store.id}>
                                        {store.storeName}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                )}
                {userType === 'employee' && (
                    <div>
                        <label>
                            Start Date:&nbsp;
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                )}
                {userType === 'employee' && (
                    <div>
                        <label>
                            Hourly Rate:&nbsp;
                            <input
                                type="number"
                                step="0.00"
                                value={hourlyRate}
                                onChange={(e) => setHourlyRate(e.target.value)}
                                required
                                placeholder="33.33"
                            />
                        </label>
                    </div>
                )}
                {userType === 'employee' && (
                    <div>
                        <label>
                            Check if Manager: &nbsp;
                            <input
                                type="checkbox"
                                checked={managers}
                                onChange={(e) => setManagers(e.target.checked)}
                            />
                        </label>
                    </div>
                )}
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
            {showConfirmation && (
        <div className="modal">
          <div className="modal-content">
            <h3>Thank you for registering!</h3>
            <button onClick={handleCloseConfirmation}>Close</button>
          </div>
        </div>
      )}
            <p>
                Already have an account? <Link to="/login">Log in here</Link>
            </p>
        </div>
    );
};
