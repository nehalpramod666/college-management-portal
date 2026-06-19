import { Link, Outlet, useNavigate } from "react-router-dom";

const MainLayout = () => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          background: "#1f2937",
          color: "white",
          padding: "20px",
        }}
      >
        <h2>College ERP</h2>

        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/departments">Departments</Link></li>
          <li><Link to="/courses">Courses</Link></li>
          <li><Link to="/students">Students</Link></li>
          <li><Link to="/faculty">Faculty</Link></li>
          <li><Link to="/attendance">Attendance</Link></li>
          <li><Link to="/results">Results</Link></li>
        </ul>

        <button onClick={logoutHandler}>
          Logout
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;