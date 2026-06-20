import { useState, useEffect } from "react";
import api from "../../api/axios";

const emptyForm = {
  courseCode: "",
  courseName: "",
  credits: 3,
  semester: 1,
  department: "",
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data.courses);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load courses");
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments");
      setDepartments(res.data.departments);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load departments");
    }
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([fetchCourses(), fetchDepartments()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "credits" || name === "semester" ? Number(value) : value,
    });
  };

  const openCreateForm = () => {
    if (departments.length === 0) {
      setError("Create a department first before adding courses.");
      return;
    }
    setFormData({ ...emptyForm, department: departments[0]._id });
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (course) => {
    setFormData({
      courseCode: course.courseCode,
      courseName: course.courseName,
      credits: course.credits,
      semester: course.semester,
      department: course.department?._id || "",
    });
    setEditingId(course._id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (editingId) {
        await api.put(`/courses/${editingId}`, formData);
      } else {
        await api.post("/courses", formData);
      }
      await fetchCourses();
      closeForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save course");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course? This cannot be undone.")) return;
    try {
      await api.delete(`/courses/${id}`);
      await fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete course");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
        <button
          onClick={openCreateForm}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          + Add Course
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-6 p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Course" : "New Course"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  name="courseCode"
                  required
                  value={formData.courseCode}
                  onChange={handleChange}
                  placeholder="CS101"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  name="courseName"
                  required
                  value={formData.courseName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credits
                </label>
                <input
                  type="number"
                  name="credits"
                  required
                  min={1}
                  value={formData.credits}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semester
                </label>
                <input
                  type="number"
                  name="semester"
                  required
                  min={1}
                  max={8}
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                name="department"
                required
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
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
                {submitting ? "Saving..." : editingId ? "Update" : "Create"}
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
        <p className="text-gray-500">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-gray-500">No courses yet.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Semester</th>
                <th className="px-4 py-3">Credits</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courses.map((course) => (
                <tr key={course._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {course.courseCode}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{course.courseName}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {course.department?.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{course.semester}</td>
                  <td className="px-4 py-3 text-gray-600">{course.credits}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => openEditForm(course)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
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

export default Courses;