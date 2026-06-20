import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const links = [
  { path: "/faculty", label: "My Courses", end: true },
  { path: "/faculty/attendance", label: "Mark Attendance" },
  { path: "/faculty/results", label: "Enter Results" },
];

const FacultyLayout = () => {
  return (
    <div className="flex">
      <Sidebar title="Faculty Panel" links={links} />
      <div className="flex-1 min-h-screen bg-gray-50">
        <Navbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FacultyLayout;