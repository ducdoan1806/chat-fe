import { createContext, useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { AccessTokenCookie } from "../utils/token";

// Tạo context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/profile/");
      setUser(res?.results?.[0]);
    } catch (e) {
      AccessTokenCookie.delete();
      setUser(null);
      navigate("/login", { replace: true });
    } finally {
      setLoading(false);
    }
  }, [navigate]);
  useEffect(() => {
    getProfile();
  }, [getProfile]);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
