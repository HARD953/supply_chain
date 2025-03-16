import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://supply-3.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const publicEndpoints = ['/login/', '/register/', '/token/refresh/'];
    if (!publicEndpoints.some(endpoint => config.url?.includes(endpoint))) {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = async (email, password) => {
  try {
    const response = await api.post('/login/', { email, password });
    return response.data; // { access, refresh, user_id, email, user_type, username }
  } catch (error) {
    throw error.response?.data || { message: 'Erreur de connexion' };
  }
};

export const refreshToken = async (refreshToken) => {
  try {
    const response = await api.post('/token/refresh/', { refresh: refreshToken });
    return response.data; // { access }
  } catch (error) {
    throw error.response?.data || { message: 'Erreur de rafraîchissement du token' };
  }
};

export const registerShop = async (shopData) => {
  try {
    const config = shopData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } } 
      : {};
    const response = await api.post('/register/', shopData, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la création de la boutique' };
  }
};

export const logout = async (refreshToken) => {
  try {
    const response = await api.post('/logout/', { refresh: refreshToken });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur de déconnexion' };
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/current-user/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de la récupération de l'utilisateur" };
  }
};

export default api;