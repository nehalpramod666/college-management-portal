import { useState, useEffect } from "react";
import api from "../../api/axios";

const StatCard = ({ label, value, color }) => (
  <div className={`bg-white rounded-lg border border-gray-200 p-5 flex flex-col gap-2`}>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard/admin");
        setStats(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = stats
    ? [
        { label: "Total Students", value: stats.totalStudents, color: "text-blue-600" },
        { label: "Total Faculty", value: stats.totalFaculty, color: "text-purple-600" },
        { label: "Departments", value: stats.totalDepartments, color: "text-green-600" },
        { label: "Courses", value: stats.totalCourses, color: "text-yellow-600" },
        { label: "Attendance Records", value: stats.totalAttendance, color: "text-pink-600" },
        { label: "Results Entered", value: stats.totalResults, color: "text-orange-600" },
      ]
    : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of the college management portal
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;