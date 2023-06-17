import React, { useEffect, useState } from 'react';
import './Pages.css';

export const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [editedEmployee, setEditedEmployee] = useState(null);
  const [updatedStartDate, setUpdatedStartDate] = useState('');
  const [updatedPayRate, setUpdatedPayRate] = useState('');
  const [updatedName, setUpdatedName] = useState('');
  const [updatedAddress, setUpdatedAddress] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedPhone, setUpdatedPhone] = useState('');
  const [user, setUser] = useState('')

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
        const response = await fetch('http://localhost:8088/employees?_expand=user&_expand=store');
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (employeeId) => {
    const employee = employees.find((employee) => employee.id === employeeId);
    setEditedEmployee(employee);
    setUpdatedStartDate(employee.startDate);
    setUpdatedPayRate(employee.payRate);
  };

  const handleSave = async (employeeId) => {
    const updatedEmployee = {
      ...editedEmployee,
      startDate: updatedStartDate,
      payRate: parseFloat(updatedPayRate),
    };

    try {
      await fetch(`http://localhost:8088/employees/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEmployee),
      });

      const updatedEmployees = employees.map((employee) =>
        employee.id === employeeId ? updatedEmployee : employee
      );
      setEmployees(updatedEmployees);

      setEditedEmployee(null);

      window.alert('Changes saved!');
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const isEmployee = user?.isStaff;

  return (
    <div>
      {isEmployee && (
        <div className="object-list">
          <h1>Employees</h1>
          {employees.map((employee) => {
            const user = employee.user;
  
            return (
              <div key={employee.id} className="object-item">
                <div className="object-details">
                  <h2>{user.fullName}</h2>
                  {user && (
                    <>
                      <p>Name: {user.fullName}</p>
                      <p>Store Location: {employee.store && employee.store.storeName}</p>
                    </>
                  )}
  
                  {/* Edit and Cancel buttons */}
                  {isEmployee && editedEmployee && editedEmployee.id === employee.id ? (
                    <div className="edit-object">
                      <input
                        type="text"
                        id="employeeName"
                        value={user.fullName}
                        onChange={(e) => setUpdatedName(e.target.value)}
                      />
                      <input
                        type="email"
                        id="employeeEmail"
                        value={user.email}
                        onChange={(e) => setUpdatedEmail(e.target.value)}
                      />
                      <input
                        type="phone"
                        id="employeePhone"
                        value={user.phone}
                        onChange={(e) => setUpdatedPhone(e.target.value)}
                      />
                      <input
                        type="address"
                        id="employeeAddress"
                        value={user.streetAddress}
                        onChange={(e) => setUpdatedAddress(e.target.value)}
                      />
                      <input
                        type="date"
                        id="startDate"
                        value={employee.startDate}
                        onChange={(e) => setUpdatedStartDate(e.target.value)}
                      />
                      <input
                        type="number"
                        step="0.01"
                        id="payRate"
                        value={employee.payRate.toFixed(2)}
                        onChange={(e) => setUpdatedPayRate(e.target.value)}
                      />
                      <button className="action-button" onClick={() => handleSave(employee.id)}>
                        Save
                      </button>
                      <button className="action-button" onClick={() => setEditedEmployee(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button className="action-button" onClick={() => handleEdit(employee.id)}>
                        View/Edit Details
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
  );
  
};
