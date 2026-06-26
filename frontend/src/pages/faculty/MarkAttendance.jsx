import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const MarkAttendance = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const course = location.state?.course || null;

  const [students, setStudents] = useState([]);
  const [facultyProfile, setFacultyProfile] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
  if (!course) return;
  const load = async () => {
    try {
      const [facRes, enrollRes] = await Promise.all([
        api.get("/faculty"),
        api.get(`/enrollments/course/${course._id}`),
      ]);

      const mine = facRes.data.faculty.find(
        (f) => f.user?._id === user.id || f.user?._id === user._id
      );
      setFacultyProfile(mine);

      // Get the actual Student objects from enrollments
      const enrolledStudents = enrollRes.data.enrollments.map(
        (e) => e.student
      );
      setStudents(enrolledStudents);

      // Default everyone to Present
      const defaultAttendance = {};
      enrolledStudents.forEach((s) => {
        defaultAttendance[s._id] = "Present";
      });
      setAttendance(defaultAttendance);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };
  load();
}, [course]);

  const toggleStatus = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "Present" ? "Absent" : "Present",
    }));
  };

  const handleSubmit = async () => {
    if (!facultyProfile) {
      setError("Faculty profile not found.");
      return;
    }
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await Promise.all(
        students.map((student) =>
          api.post("/attendance", {
            student: student._id,
            course: course._id,
            date,
            status: attendance[student._id],
            markedBy: facultyProfile._id,
          })
        )
      );
      setSuccess("Attendance marked successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to mark attendance. It may already be marked for this date."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!course) {
    return (
      <div>
        <p className="text-gray-500 mb-3">No course selected.</p>
        <button
          onClick={() => navigate("/faculty")}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back to My Courses
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate("/faculty")}
        className="text-sm text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back to My Courses
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mark Attendance</h1>
        <p className="text-sm text-gray-500 mt-1">
          {course.courseCode} — {course.courseName} &nbsp;·&nbsp; Semester{" "}
          {course.semester}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded">
          {success}
        </div>
      )}

      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Loading students...</p>
      ) : students.length === 0 ? (
        <p className="text-gray-500">
          No students found for this course's department and semester.
        </p>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Roll No.</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student) => {
                  const status = attendance[student._id];
                  const isPresent = status === "Present";
                  return (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {student.rollNumber}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {student.user?.name || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            isPresent
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleStatus(student._id)}
                          className="text-xs px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
                        >
                          Toggle
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Attendance"}
          </button>
        </>
      )}
    </div>
  );
};

export default MarkAttendance;