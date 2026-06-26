import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const MyAttendance = () => {
  const { user } = useAuth();

  const [attendance, setAttendance] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        // Step 1: find this user's Student record
        const stuRes = await api.get("/students");
        const mine = stuRes.data.students.find(
          (s) => s.user?._id === user.id || s.user?._id === user._id
        );

        if (!mine) {
          setError(
            "No student profile found for your account. Contact an admin."
          );
          setLoading(false);
          return;
        }

        setStudentProfile(mine);

        // Step 2: fetch attendance for this student
        const attRes = await api.get(`/attendance/student/${mine._id}`);
        setAttendance(attRes.data.attendance);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load attendance");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Calculate summary stats
  const total = attendance.length;
  const present = attendance.filter((a) => a.status === "Present").length;
  const absent = total - present;
  const percentage = total > 0 ? Math.round((present / total) * 100) : null;

  const percentageColor =
    percentage === null
      ? "text-gray-500"
      : percentage >= 75
      ? "text-green-600"
      : percentage >= 50
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Attendance</h1>
        {studentProfile && (
          <p className="text-sm text-gray-500 mt-1">
            {studentProfile.rollNumber} &nbsp;·&nbsp;{" "}
            {studentProfile.department?.name} &nbsp;·&nbsp; Semester{" "}
            {studentProfile.semester}
          </p>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}

      {/* Summary cards */}
      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 font-medium">Total Classes</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{total}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 font-medium">Present</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{present}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 font-medium">Absent</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{absent}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 font-medium">Percentage</p>
            <p className={`text-2xl font-bold mt-1 ${percentageColor}`}>
              {percentage !== null ? `${percentage}%` : "—"}
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading attendance...</p>
      ) : attendance.length === 0 ? (
        <p className="text-gray-500">No attendance records found.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Course Code</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {attendance.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(record.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-gray-800 font-medium">
                    {record.course?.courseName || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {record.course?.courseCode || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        record.status === "Present"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyAttendance;