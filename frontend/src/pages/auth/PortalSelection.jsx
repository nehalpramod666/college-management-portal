import { useNavigate } from "react-router-dom";

const PortalSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">
          Select Portal
        </h1>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/login/student")}
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Student Portal
          </button>

          <button
            onClick={() => navigate("/login/faculty")}
            className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Faculty Portal
          </button>

          <button
            onClick={() => navigate("/login/admin")}
            className="w-full py-3 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Admin Portal
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortalSelection;