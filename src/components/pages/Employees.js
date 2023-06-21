import React, { useEffect, useState } from 'react';
import './Pages.css';

export const Employees = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState([])
  const [employees, setEmployees] = useState([]);
  const [editedUser, setEditedUser] = useState(null);
  const [editedEmployee, setEditedEmployee] = useState(null);
  const [updatedFullName, setUpdatedFullName] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedPhone, setUpdatedPhone] = useState('');
  const [updatedAddress, setUpdatedAddress] = useState('');
  const [updatedStartDate, setUpdatedStartDate] = useState('');
  const [updatedPayRate, setUpdatedPayRate] = useState('');
  const [isEditing, setIsEditing] = useState(null)

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
        const response = await fetch('http://localhost:8088/employees?_expand=user');
        const data = await response.json();

        // Separate users and employees data
        const usersData = data.map((item) => item.user);
        const employeesData = data.map((item) => ({
          ...item,
          user: undefined, // Remove user data from employees array
        }));

        setUsers(usersData);
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (userId, employeeId) => {
    const user = users.find((user) => user.id === userId);
    setEditedUser(user);
    setUpdatedFullName(user.fullName);
    setUpdatedEmail(user.email);
    setUpdatedPhone(user.phone);
    setUpdatedAddress(user.streetAddress);

    const employee = employees.find((employee) => employee.id === employeeId);
    setEditedEmployee(employee);
    setUpdatedStartDate(employee.startDate);
    setUpdatedPayRate(employee.payRate);

    setIsEditing(employee.id); // Enable editing mode
  };

  const handleSave = async (userId) => {
    const updatedUser = {
      ...editedUser,
      fullName: updatedFullName,
      email: updatedEmail,
      phone: updatedPhone,
      streetAddress: updatedAddress,
      isStaff: editedUser.isStaff,
      isManager: editedUser.isManager,
    };

    const updatedEmployee = {
      ...editedEmployee,
      startDate: updatedStartDate,
      payRate: parseInt(updatedPayRate),
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

      // Update the employee data
      await fetch(`http://localhost:8088/employees/${updatedEmployee.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedEmployee),
    });

      // Refresh the data
      const updatedUsers = users.map((user) => (user.id === userId ? updatedUser : user));
      setUsers(updatedUsers);

      const updatedEmployees = employees.map((employee) =>
        employee.id === updatedEmployee.id ? updatedEmployee : employee
      );
      setUsers(updatedUsers);
      setEmployees(updatedEmployees);

      setIsEditing(null); // Disable editing mode

      window.alert('Changes saved!');
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const handleDelete = async (employeeId, userId) => {
    try {
      // Delete the employee from the /employees endpoint
      await fetch(`http://localhost:8088/employees/${employeeId}`, {
        method: 'DELETE',
      });

      // Delete the corresponding user from the /users endpoint
      await fetch(`http://localhost:8088/users/${userId}`, {
        method: 'DELETE',
      });

      // Remove the deleted employee from the state
      const updatedEmployees = employees.filter((employee) => employee.id !== employeeId);
      setEmployees(updatedEmployees);

      // Remove the deleted user from the state
      const updatedUsers = users.filter((user) => user.id !== userId);
      setUsers(updatedUsers);

      window.alert('Employee deleted!');
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const isEmployee = user?.isStaff

  return (
    <div className="employees">
          <h1>Employees</h1>
          {employees.map((employee) => {
            const employeeUser = users.find((user) => user.id === employee.userId);

            // Check if the current employee is being edited
        const employeeIsEditing = isEditing === employee.id;

            return (
              <div key={employee.id}>
                <div>
                  <h2>{employeeUser.fullName}</h2>
                  {employeeUser && (
                    <>
                      <p>Name: {employeeUser.fullName}</p>
                      <p>Email: {employeeUser.email}</p>
                      <p>Phone: {employeeUser.phone}</p>
                      <p>Address: {employeeUser.streetAddress}</p>
                    </>
                  )}
                  <p>Start Date: {employee.startDate}</p>
                  <p>Pay Rate: ${employee.payRate.toFixed(2)}</p>

                  {/* Edit and Delete buttons */}
                  {isEditing !== null && employeeIsEditing && (
                    <div className="edit-object">
                      <input
                        type="text"
                        id="employeeName"
                        value={updatedFullName}
                        onChange={(e) => setUpdatedFullName(e.target.value)}
                      />
                      <input
                        type="text"
                        id="employeeEmail"
                        value={updatedEmail}
                        onChange={(e) => setUpdatedEmail(e.target.value)}
                      />
                      <input
                        type="text"
                        id="employeePhone"
                        value={updatedPhone}
                        onChange={(e) => setUpdatedPhone(e.target.value)}
                      />
                      <input
                        type="text"
                        id="employeeAddress"
                        value={updatedAddress}
                        onChange={(e) => setUpdatedAddress(e.target.value)}
                      />
                      <input
                        type="text"
                        id="startDate"
                        value={updatedStartDate}
                        onChange={(e) => setUpdatedStartDate(e.target.value)}
                      />
                      <input
                        type="text"
                        id="payRate"
                        value={updatedPayRate}
                        onChange={(e) => setUpdatedPayRate(e.target.value)}
                      />
                      <button className="action-button" onClick={() => handleSave(employeeUser.id)}>
                        Save
                      </button>
                      <button className="action-button" onClick={() => setIsEditing(null)}>
                        Cancel
                      </button>
                    </div>
                  )}

{isEditing === null && (
                    <div>
                      <button
                        className="action-button"
                        onClick={() => handleEdit(employeeUser.id, employee.id)}
                      >
                        View/Edit Details
                      </button>
                      </div>
                      )}

                      {isEmployee && (
                        <div>
                      <button
                        className="action-button"
                        onClick={() => handleDelete(employee.id, employeeUser.id)}
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