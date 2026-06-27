import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-3">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          College Management Portal
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-800">{user?.name}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-sm font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;