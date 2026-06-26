import { useState, useEffect } from "react";
import api from "../../api/axios";

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ student: "", course: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchEnrollments = async () => {
    try {
      const res = await api.get("/enrollments");
      setEnrollments(res.data.enrollments);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load enrollments");
    }
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [stuRes, courseRes] = await Promise.all([
        api.get("/students"),
        api.get("/courses"),
      ]);
      setStudents(stuRes.data.students);
      setCourses(courseRes.data.courses);
      await fetchEnrollments();
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openForm = () => {
    if (students.length === 0 || courses.length === 0) {
      setError("Make sure students and courses exist before enrolling.");
      return;
    }
    setFormData({
      student: students[0]._id,
      course: courses[0]._id,
    });
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setFormData({ student: "", course: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/enrollments", formData);
      await fetchEnrollments();
      closeForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to enroll student");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this enrollment?")) return;
    try {
      await api.delete(`/enrollments/${id}`);
      await fetchEnrollments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove enrollment");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Enrollments</h1>
        <button
          onClick={openForm}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          + Enroll Student
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-6 p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">New Enrollment</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student
              </label>
              <select
                name="student"
                required
                value={formData.student}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {students.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.rollNumber} — {s.user?.name || "Unknown"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course
              </label>
              <select
                name="course"
                required
                value={formData.course}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.courseCode} — {c.courseName} (Sem {c.semester})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? "Enrolling..." : "Enroll"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading enrollments...</p>
      ) : enrollments.length === 0 ? (
        <p className="text-gray-500">No enrollments yet.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Roll No.</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Semester</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {enrollments.map((e) => (
                <tr key={e._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {e.student?.user?.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {e.student?.rollNumber || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {e.course?.courseName || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {e.course?.courseCode || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {e.course?.semester || "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(e._id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Remove
                    </button>
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

export default Enrollments;