import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const AuthProtected = ({ children }) => {
  // const [isTokenValid, setIsTokenValid] = useState(null);

  // useEffect(() => {
  //   const checkTokenValidity = async () => {
  //     const token = localStorage.getItem('token');
  //     if (!token) {
  //       setIsTokenValid(false);
  //       return;
  //     }
  //     try {
  //       const response = await axios.post(`${apiUrlBase}/validate-token`, { token });
  //       setIsTokenValid(response.data.isValid);
  //     } catch (error) {
  //       setIsTokenValid(false);
  //     }
  //   };

  //   checkTokenValidity();
  // }, []);

  // if (isTokenValid === null) {
  //   return <div>Loading...</div>;
  // }

  // if (!isTokenValid) {
  //   return <Navigate to="/login" />;
  // }

  return <>{children}</>;
};

export { AuthProtected };