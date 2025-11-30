import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [packages, setPackages] = useState([]);


  const [users, setUsers] = useState([
    { name: 'Isha Singh', role: 'student', id: 'S123', email: 'isha@test.com', password: '123' },
    { name: 'Ramesh Kumar', role: 'delivery', id: 'D456', email: 'ramesh@test.com', password: '123' },
    { name: 'Security Chief', role: 'guard', id: 'G789', email: 'guard@test.com', password: '123' }
  ]);

  const login = (identifier, password, role) => {
    if (role !== 'student') {
      const mockUser = users.find(u => u.role === role);
      if (mockUser) {
        setUser(mockUser);
        return true;
      }
      return false;
    }


    const foundUser = users.find(u =>
      u.id === identifier &&
      u.password === password &&
      u.role === 'student'
    );

    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const signup = (userData) => {
    const exists = users.some(u => u.email === userData.email || u.id === userData.studentId);
    if (exists) return false;

    const newUser = {
      name: userData.name,
      role: 'student',
      id: userData.studentId,
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
