import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import {API_URL} from "../config";

function AuthProtected({ children }) {
  const [isTokenValid, setIsTokenValid] = useState(null);

  useEffect(() => {
    const checkTokenValidity = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsTokenValid(false);
        return;
      }
      try {
        const response = await axios.post(`${API_URL}/validate-token`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setIsTokenValid(response.data.isValid);
      } catch (error) {
        setIsTokenValid(false);
      }
    };

    checkTokenValidity();
  }, []);

  if (isTokenValid === null) {
    return 
  }

  if (!isTokenValid) {
    return <Navigate to="/auth-login" />;
  }

  return <>{children}</>;
};

export { AuthProtected };