import { createContext, useContext, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
};
