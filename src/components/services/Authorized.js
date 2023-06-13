// // Authorized.js component code:
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Header } from '../navigation/Header';
// import { Login } from '../pages/Login';
// import { Profile } from '../pages/Profile';

// export const Authorized = () => {
//   const navigate = useNavigate();

//   const handleLogin = async (credentials) => {
//     try {
//       const response = await fetch(`http://localhost:8088/users?email=${credentials.email}`);
//       const foundUsers = await response.json();
//       if (foundUsers.length === 1) {
//         const user = foundUsers[0];
//         navigate(`/profile/${user.userId}`); // Redirect to the profile page after successful login
//       } else {
//         window.alert("Invalid login");
//       }
//     } catch (error) {
//       console.error('An error occurred:', error);
//     }
//   };

//   return (
//     <>
//       <Profile />
//     </>
//   );
// };
