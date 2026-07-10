import { useContext, useState } from "react";
import { login, Logout, register } from "../services/auth.service";
import { AuthContext } from "../Auth.context";

const useAuth = () => {
  const { user, loading, error, setLoading, setUser, setError } =
    useContext(AuthContext);

  const handleRegister = async ({ username, email, password }) => {
    try {
      setLoading(true);
      const res = await register({ username, email, password });
      setUser(res.user);
      return res;
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async ({ email, password }) => {
    try {
      setLoading(true);
      const res = await login({ email, password });
      setUser(res.user);
      return res;
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const res = await Logout();
      setUser(null);
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleRegister,
    handleLogin,
    handleLogout,
    user,
    loading,
    error,
  };
};

export default useAuth;
