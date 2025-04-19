// api/userAPI.js
import axios from "axios";
import {API_URL} from "../../config";

export const fetchUserData = async (token) => {
  const response = await axios.get(`${API_URL}/users/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateUser = async ({ userId, updatedData, token }) => {
  const response = await axios.put(`${API_URL}/users/${userId}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const updateUserImages = async ({ userId, formData, token }) => {
  const response = await axios.put(`${API_URL}/users/update-images/${userId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

