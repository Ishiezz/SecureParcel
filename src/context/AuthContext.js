import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [packages, setPackages] = useState([]);

  const [users, setUsers] = useState([
    { name: 'Isha Singh', role: 'student', id: 'S123', email: 'isha.singh@university.edu', password: '123', department: 'Computer Science', phone: '+91 98765 43210' },
    { name: 'Ramesh Kumar', role: 'delivery', id: 'D456', email: 'ramesh@delivery.com', password: '123', department: 'Logistics', phone: '+91 98765 43211' },
    { name: 'Security Chief', role: 'guard', id: 'G789', email: 'security@campus.com', password: '123', department: 'Campus Security', phone: '+91 98765 43212' }
  ]);



  const login = async (identifier, password, role, name) => {
    let foundUser = users.find(u => {
      if (role === 'student') {
        return u.id === identifier && u.password === password && u.role === role;
      } else {

        return u.id === identifier && u.role === role;
      }
    });

    if (foundUser) {

      if (name && foundUser.name !== name) {
        foundUser.name = name;
        setUsers(users.map(u => u.id === foundUser.id ? foundUser : u));
      }
      setUser(foundUser);


      try {
        await AsyncStorage.setItem('userCredentials', JSON.stringify({
          identifier,
          password,
          role,
          name: foundUser.name
        }));
      } catch (e) {
        console.error('Failed to save credentials', e);
      }

      return true;
    } else if (role !== 'student' && name) {

      const newUser = {
        name: name,
        role: role,
        id: identifier,
        email: `${role}${identifier}@test.com`,
        password: '123'
      };
      setUsers([...users, newUser]);
      setUser(newUser);


      try {
        await AsyncStorage.setItem('userCredentials', JSON.stringify({
          identifier,
          password: '123',
          role,
          name
        }));
      } catch (e) {
        console.error('Failed to save credentials', e);
      }

      return true;
    }

    return false;
  };

  const getSavedCredentials = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userCredentials');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Failed to fetch credentials', e);
      return null;
    }
  };

  const signup = async (userData) => {
    const exists = users.some(u => u.email === userData.email || u.id === userData.studentId);
    if (exists) return false;

    const newUser = {
      name: userData.name,
      role: userData.role,
      id: userData.studentId,
      email: userData.email,
      password: userData.password,
      department: userData.department
    };

    setUsers([...users, newUser]);


    setUser(newUser);


    try {
      await AsyncStorage.setItem('userCredentials', JSON.stringify({
        identifier: newUser.id,
        password: newUser.password,
        role: newUser.role,
        name: newUser.name
      }));
    } catch (e) {
      console.error('Failed to save credentials', e);
    }

    return true;
  };

  const logout = () => {
    setUser(null);
  };


  const addPackage = (pkg) => {
    setPackages(prev => [...prev, { ...pkg, id: Date.now().toString(), status: 'stored' }]);
  };


  const collectPackage = (packageId, guardName, guardId) => {
    setPackages(prev => prev.map(p => p.id === packageId ? {
      ...p,
      status: 'collected',
      collectedAt: new Date().toISOString(),
      guardName: guardName || 'Unknown Guard',
      guardId: guardId || 'G-XXXX'
    } : p));
  };

  const verifyStudent = (name, id) => {
    return users.some(u =>
      u.role === 'student' &&
      u.id === id &&
      u.name.toLowerCase() === name.toLowerCase()
    );
  };

  const [biometricEnabled, setBiometricEnabled] = useState(true);

  useEffect(() => {
    loadBiometricPreference();
  }, []);

  const loadBiometricPreference = async () => {
    try {
      const value = await AsyncStorage.getItem('biometricEnabled');
      if (value !== null) {
        setBiometricEnabled(JSON.parse(value));
      } else {

        setBiometricEnabled(true);
      }
    } catch (e) {
      console.error('Failed to load biometric preference', e);
    }
  };

  const toggleBiometric = async () => {
    try {
      const newValue = !biometricEnabled;
      setBiometricEnabled(newValue);
      await AsyncStorage.setItem('biometricEnabled', JSON.stringify(newValue));
    } catch (e) {
      console.error('Failed to save biometric preference', e);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      packages,
      addPackage,
      collectPackage,
      signup,
      getSavedCredentials,
      verifyStudent,
      biometricEnabled,
      toggleBiometric
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
