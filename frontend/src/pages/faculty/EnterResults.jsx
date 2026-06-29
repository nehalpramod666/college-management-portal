import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const EnterResults = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const course = location.state?.course || null;

  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [existingResults, setExistingResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
  if (!course) return;
  const load = async () => {
    try {
      // Get enrolled students for this course
      const enrollRes = await api.get(`/enrollments/course/${course._id}`);
      const enrolledStudents = enrollRes.data.enrollments.map((e) => e.student);
      setStudents(enrolledStudents);

      // Fetch results for each enrolled student individually
      const existing = {};
      const existingIds = {};

      await Promise.all(
        enrolledStudents.map(async (student) => {
          try {
            const res = await api.get(`/results/student/${student._id}`);
            const match = res.data.results.find(
              (r) =>
                r.course?._id === course._id || r.course === course._id
            );
            if (match) {
              existing[student._id] = match.marks;
              existingIds[student._id] = match._id;
            }
          } catch {
            // student has no results yet, that's fine
          }
        })
      );

      setMarks(existing);
      setExistingResults(existingIds);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };
  load();
}, [course]);

  const handleMarkChange = (studentId, value) => {
    setMarks((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await Promise.all(
        students.map((student) => {
          const mark = Number(marks[student._id]);
          if (isNaN(mark) || marks[student._id] === "") return null;

          const existingResultId = existingResults[student._id];

          if (existingResultId) {
            return api.put(`/results/${existingResultId}`, { marks: mark });
          } else {
            return api.post("/results", {
              student: student._id,
              course: course._id,
              marks: mark,
            });
          }
        })
      );
      setSuccess("Results saved successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save results");
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
        <h1 className="text-2xl font-bold text-gray-800">Enter Results</h1>
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
                  <th className="px-4 py-3">Marks (0–100)</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student) => {
                  const hasResult = !!existingResults[student._id];
                  return (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {student.rollNumber}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {student.user?.name || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={marks[student._id] ?? ""}
                          onChange={(e) =>
                            handleMarkChange(student._id, e.target.value)
                          }
                          className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="—"
                        />
                      </td>
                      <td className="px-4 py-3">
                        {hasResult ? (
                          <span className="text-xs text-green-600 font-medium">
                            Saved
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">Not entered</span>
                        )}
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
            className="px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Results"}
          </button>
        </>
      )}
    </div>
  );
};

export default EnterResults;