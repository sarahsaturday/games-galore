import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Pages.css'

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
        setUserType(e.target.value === 'employee' ? 'employee' : 'customer');
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
                    id: highestId + 1, // Convert to integer
                    fullName,
                    email,
                    phone,
                    streetAddress: address,
                    isStaff: userType === 'employee',
                    isManager: userType === 'employee' && managers,
                };

                // Determine the type of the new user
                const newUserType = newUser.isStaff ? 'employee' : 'customer';

                // Add the new user to the users database
                fetch('http://localhost:8088/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newUser),
                })
                    .then(() => {
                        if (userType === 'customer') {
                            // Fetch existing customers from the database
                            fetch('http://localhost:8088/customers')
                                .then((response) => response.json())
                                .then((customers) => {
                                    // Determine the highest loyalty number
                                    const highestLoyaltyNumber = customers.reduce(
                                        (maxLoyaltyNumber, customer) => Math.max(maxLoyaltyNumber, customer.loyaltyNumber),
                                        0
                                    );

                                    // Determine the highest ID
                                    const highestCustomerId = customers.reduce((maxId, customer) => Math.max(maxId, parseInt(customer.id)), 0);

                                    // Create a new customer object with the next loyalty number
                                    const newCustomer = {
                                        id: highestCustomerId + 1, // Convert to integer
                                        loyaltyNumber: highestLoyaltyNumber + 1, // Increase by one
                                        userId: newUser.id,
                                    };

                                    // Add the new customer to the customers database
                                    fetch('http://localhost:8088/customers', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(newCustomer),
                                    })
                                        .then(() => {
                                            // Store the registered user's information in local storage
                                            localStorage.setItem('gg_user', JSON.stringify(newUser));

                                            // Show the confirmation message in an alert window
                                            window.alert('Thank you for registering!');

                                            // Dispatch storage event to update the user state in the Header component
                                            window.dispatchEvent(new Event('storage'));

                                            // Redirect the user to the home page
                                            navigate('/');
                                        })
                                        .catch((error) => {
                                            console.error('Error adding customer:', error);
                                        });
                                })
                                .catch((error) => {
                                    console.error('Error fetching customers:', error);
                                });
                        } else if (userType === 'employee') {
                            // Fetch existing employees from the database
                            fetch('http://localhost:8088/employees')
                                .then((response) => response.json())
                                .then((employees) => {

                                    // Determine the highest ID
                                    const highestEmployeeId = employees.reduce((maxId, employee) => Math.max(maxId, parseInt(employee.id)), 0);


                                    // Existing logic for isStaff=true
                                    const newEmployee = {
                                        id: highestEmployeeId + 1, // Convert to integer
                                        startDate: new Date(startDate), // Convert to date object
                                        payRate: parseFloat(hourlyRate),
                                        userId: newUser.id,
                                        storeId: parseInt(selectedStore),
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
                                            // Fetch the selected store
                                            fetch(`http://localhost:8088/stores/${selectedStore}`)
                                                .then((response) => response.json())
                                                .then((store) => {
                                                    // Get the current employee IDs array from the store object
                                                    const employeeIds = store.employeeId || [];

                                                    // Push the new employee ID into the employee IDs array
                                                    employeeIds.push(newEmployee.id);

                                                    // Update the selected store with the new employee ID
                                                    fetch(`http://localhost:8088/stores/${selectedStore}`, {
                                                        method: 'PATCH',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                        },
                                                        body: JSON.stringify({
                                                            employeeId: employeeIds,
                                                        }),
                                                    })
                                                        .then(() => {
                                                            // Store the registered user's information in local storage
                                                            localStorage.setItem('gg_user', JSON.stringify(newUser));

                                                            // Show the confirmation message in an alert window
                                                            window.alert('Thank you for registering!');

                                                            // Dispatch storage event to update the user state in the Header component
                                                            window.dispatchEvent(new Event('storage'));

                                                            // Redirect the user to the home page
                                                            navigate('/');
                                                        })
                                                        .catch((error) => {
                                                            // Error updating the store object
                                                            console.error('Error updating store:', error);
                                                        });
                                                })
                                                .catch((error) => {
                                                    // Error fetching the selected store
                                                    console.error('Error fetching store:', error);
                                                });
                                        })
                                        .catch((error) => {
                                            // Error adding the new employee
                                            console.error('Error adding employee:', error);
                                        });
                                })
                                .catch((error) => {
                                    // Error fetching existing employees
                                    console.error('Error fetching employees:', error);
                                });
                        }
                    });
            })
    }



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
                {userType === 'employee' && (
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
                <button type="submit">Register</button>
                <p><Link to="/">Cancel</Link>
                </p>
            </form>
            <p>
                Already have an account? <Link to="/login">Log in here</Link>
            </p>
        </div>
    );
};