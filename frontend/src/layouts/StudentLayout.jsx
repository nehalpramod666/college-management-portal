import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const links = [
  { path: "/student", label: "My Attendance", end: true },
  { path: "/student/results", label: "My Results" },
];

const StudentLayout = () => {
  return (
    <div className="flex">
      <Sidebar title="Student Panel" links={links} />
      <div className="flex-1 min-h-screen bg-gray-50">
        <Navbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;