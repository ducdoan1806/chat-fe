import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Main = () => {
  return (
    <div className="flex flex-1 bg-gray-200">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default Main;
