import { createContext, useCallback, useEffect, useState } from "react";
import api from "../utils/api";

const RoomsContext = createContext();
export const RoomsProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);

  const getRooms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/conversations/");
      setRooms(res.results);
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    getRooms();
  }, [getRooms]);

  return (
    <RoomsContext.Provider value={{ rooms, setRooms, loading }}>
      {children}
    </RoomsContext.Provider>
  );
};
export default RoomsContext;