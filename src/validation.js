// src/utils/validation.js

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const validatePassword = (password) => {
    return {
      isValid: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };
  
  export const getPasswordStrength = (password) => {
    const validation = validatePassword(password);
    let strength = 0;
    
    if (validation.hasUpperCase) strength++;
    if (validation.hasLowerCase) strength++;
    if (validation.hasNumbers) strength++;
    if (validation.hasSpecialChar) strength++;
    if (password.length >= 12) strength++;
    
    if (strength < 2) return { score: 1, label: 'Faible' };
    if (strength < 4) return { score: 2, label: 'Moyen' };
    return { score: 3, label: 'Fort' };
  };