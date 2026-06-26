import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Enrollments from "./pages/admin/Enrollments";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";

import AdminLayout from "./layouts/AdminLayout";
import FacultyLayout from "./layouts/FacultyLayout";
import StudentLayout from "./layouts/StudentLayout";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Departments from "./pages/admin/Departments";
import Courses from "./pages/admin/Courses";
import Students from "./pages/admin/Students";
import Faculty from "./pages/admin/Faculty";

// Faculty pages
import FacultyCourses from "./pages/faculty/FacultyCourses";
import MarkAttendance from "./pages/faculty/MarkAttendance";
import EnterResults from "./pages/faculty/EnterResults";

// Student pages
import MyAttendance from "./pages/student/MyAttendance";
import MyResults from "./pages/student/MyResults";

// Redirects "/" to the right dashboard based on role
const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  if (user.role === "faculty") return <Navigate to="/faculty" replace />;
  return <Navigate to="/student" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<HomeRedirect />} />
          <Route
            path="/unauthorized"
            element={
              <div className="flex items-center justify-center h-screen">
                <p className="text-red-500 text-lg">
                  You are not authorized to view this page.
                </p>
              </div>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="departments" element={<Departments />} />
            <Route path="courses" element={<Courses />} />
            <Route path="students" element={<Students />} />
            <Route path="faculty" element={<Faculty />} />
            <Route path="enrollments" element={<Enrollments />} />
          </Route>

          {/* Faculty routes */}
          <Route
            path="/faculty"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <FacultyLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<FacultyCourses />} />
            <Route path="attendance" element={<MarkAttendance />} />
            <Route path="results" element={<EnterResults />} />
          </Route>

          {/* Student routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<MyAttendance />} />
            <Route path="results" element={<MyResults />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;