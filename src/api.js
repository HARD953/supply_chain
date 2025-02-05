// api.js
import axios from 'axios';

const API_BASE_URL = 'https://supply-3.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fonction pour gérer la connexion
export const login = async (email, password) => {
  try {
    const response = await api.post('/login/', { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur de connexion' };
  }
};

// Fonction pour rafraîchir le token
export const refreshToken = async (refreshToken) => {
  try {
    const response = await api.post('/token/refresh/', { refresh: refreshToken });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur de rafraîchissement du token' };
  }
};

// Fonction pour créer une boutique
export const registerShop = async (shopData) => {
  try {
    const response = await api.post('/register/', shopData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la création de la boutique' };
  }
};

// Fonction pour déconnecter l'utilisateur
export const logout = async () => {
  try {
    const response = await api.post('/logout/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur de déconnexion' };
  }
};

// Fonction pour récupérer l'utilisateur connecté
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/current-user/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la récupération de l\'utilisateur' };
  }
};

export default api;