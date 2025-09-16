import { Navigate, Route, Routes } from "react-router-dom";
import Main from "./layouts/Main";
import Login from "./pages/Login";
import { UserProvider } from "./contexts/userContext";
import ChatRoom from "./pages/ChatRoom";
import { RoomsProvider } from "./contexts/RoomsContext";
import { WebSocketProvider } from "./contexts/WebSocketContext";

function App() {
  return (
    <Routes>
      <Route
        path=""
        element={
          <UserProvider>
            <WebSocketProvider>
              <RoomsProvider>
                <Main />
              </RoomsProvider>
            </WebSocketProvider>
          </UserProvider>
        }
      >
        <Route path=":id" element={<ChatRoom />} />
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
