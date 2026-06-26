import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const links = [
  { path: "/admin", label: "Dashboard", end: true },
  { path: "/admin/departments", label: "Departments" },
  { path: "/admin/courses", label: "Courses" },
  { path: "/admin/students", label: "Students" },
  { path: "/admin/faculty", label: "Faculty" },
  { path: "/admin/enrollments", label: "Enrollments" },
];

const AdminLayout = () => {
  return (
    <div className="flex">
      <Sidebar title="Admin Panel" links={links} />
      <div className="flex-1 min-h-screen bg-gray-50">
        <Navbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;