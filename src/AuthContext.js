import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin, refreshToken as refreshApiToken, getCurrentUser, logout as apiLogout } from './api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const [storedAccessToken, storedRefreshToken] = await AsyncStorage.multiGet([
          'accessToken',
          'refreshToken'
        ]);

        if (storedAccessToken[1] && storedRefreshToken[1]) {
          setAccessToken(storedAccessToken[1]);
          setRefreshToken(storedRefreshToken[1]);
          
          try {
            const userData = await getCurrentUser();
            setUser(userData);
          } catch (error) {
            const newAccessToken = await refreshAccessToken(storedRefreshToken[1]);
            const refreshedUserData = await getCurrentUser();
            setAccessToken(newAccessToken);
            setUser(refreshedUserData);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement initial:', error);
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiLogin(email, password);
      const { access, refresh, user_id, email: userEmail, user_type, username } = response;
      const userData = { user_id, email: userEmail, user_type, username };

      await AsyncStorage.multiSet([
        ['accessToken', access],
        ['refreshToken', refresh],
      ]);

      setAccessToken(access);
      setRefreshToken(refresh);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (refreshToken) {
        await apiLogout(refreshToken);
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
    }
  };

  const refreshAccessToken = async (token = refreshToken) => {
    try {
      if (!token) throw new Error('Aucun refresh token disponible');
      const response = await refreshApiToken(token);
      const { access } = response;
      await AsyncStorage.setItem('accessToken', access);
      setAccessToken(access);
      return access;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      await logout();
      throw error;
    }
  };

  const value = {
    user,
    accessToken,
    refreshToken,
    login,
    logout,
    refreshAccessToken,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);