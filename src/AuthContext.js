import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiLogin, refreshToken as refreshApiToken, getCurrentUser } from './api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  // Charger l'utilisateur et les tokens au démarrage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedAccessToken = await AsyncStorage.getItem('accessToken');
        const storedRefreshToken = await AsyncStorage.getItem('refreshToken');

        if (storedAccessToken) {
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
          const userData = await getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des informations utilisateur', error);
      }
    };

    loadUser();
  }, []);

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      const response = await apiLogin(email, password);
      await AsyncStorage.setItem('accessToken', response.access);
      await AsyncStorage.setItem('refreshToken', response.refresh);
      setAccessToken(response.access);
      setRefreshToken(response.refresh);
      setUser(response.user);
    } catch (error) {
      console.error('Erreur de connexion', error);
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  // Fonction pour rafraîchir le token automatiquement
  const refreshAccessToken = async () => {
    try {
      if (!refreshToken) return;
      const response = await refreshApiToken(refreshToken);
      await AsyncStorage.setItem('accessToken', response.access);
      setAccessToken(response.access);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token', error);
      logout(); // Déconnecter si le refresh échoue
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, refreshToken, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
