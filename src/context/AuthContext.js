import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [packages, setPackages] = useState([]);

  const [users, setUsers] = useState([
    { name: 'Isha Singh', role: 'student', id: 'S123', email: 'isha.singh@university.edu', password: '123', department: 'Computer Science', phone: '+91 98765 43210' },
    { name: 'Ramesh Kumar', role: 'delivery', id: 'D456', email: 'ramesh@delivery.com', password: '123', department: 'Logistics', phone: '+91 98765 43211' },
    { name: 'Security Chief', role: 'guard', id: 'G789', email: 'security@campus.com', password: '123', department: 'Campus Security', phone: '+91 98765 43212' }
  ]);

  const login = (identifier, password, role, name) => {
    let foundUser = users.find(u => {
      if (role === 'student') {
        return u.id === identifier && u.password === password && u.role === role;
      } else {
        // For delivery and guard, match ID and role
        return u.id === identifier && u.role === role;
      }
    });

    if (foundUser) {
      // Update name if provided and different
      if (name && foundUser.name !== name) {
        foundUser.name = name;
        setUsers(users.map(u => u.id === foundUser.id ? foundUser : u));
      }
      setUser(foundUser);
      return true;
    } else if (role !== 'student' && name) {
      // Implicit signup for Delivery/Guard if name is provided
      const newUser = {
        name: name,
        role: role,
        id: identifier,
        email: `${role}${identifier}@test.com`, // Dummy email
        password: '123' // Dummy password
      };
      setUsers([...users, newUser]);
      setUser(newUser);
      return true;
    }

    return false;
  };

  const signup = (userData) => {
    const exists = users.some(u => u.email === userData.email || u.id === userData.studentId);
    if (exists) return false;

    const newUser = {
      name: userData.name,
      role: userData.role, // Use passed role
      id: userData.studentId, // This will store either Student ID or Delivery ID
      email: userData.email,
      password: userData.password
    };

    setUsers([...users, newUser]);
    return true;
  };

  const logout = () => {
    setUser(null);
  };


  const addPackage = (pkg) => {
    setPackages(prev => [...prev, { ...pkg, id: Date.now().toString(), status: 'stored' }]);
  };


  const collectPackage = (packageId) => {
    setPackages(prev => prev.map(p => p.id === packageId ? { ...p, status: 'collected' } : p));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, packages, addPackage, collectPackage, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
