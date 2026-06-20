import { useState, useEffect } from "react";
import api from "../../api/axios";

const emptyForm = {
  user: "",
  rollNumber: "",
  department: "",
  semester: 1,
};

const Students = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/students");
      setStudents(res.data.students);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load students");
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
    await Promise.all([fetchStudents(), fetchDepartments()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "semester" ? Number(value) : value,
    });
  };

  const openCreateForm = () => {
    if (departments.length === 0) {
      setError("Create a department first before adding students.");
      return;
    }
    setFormData({ ...emptyForm, department: departments[0]._id });
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (student) => {
    setFormData({
      user: student.user?._id || "",
      rollNumber: student.rollNumber,
      department: student.department?._id || "",
      semester: student.semester,
    });
    setEditingId(student._id);
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
        // user is locked on edit (see note below), only send editable fields
        const { user, ...updateData } = formData;
        await api.put(`/students/${editingId}`, updateData);
      } else {
        await api.post("/students", formData);
      }
      await fetchStudents();
      closeForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save student");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student record? This cannot be undone.")) return;
    try {
      await api.delete(`/students/${id}`);
      await fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete student");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Students</h1>
        <button
          onClick={openCreateForm}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          + Add Student
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
            {editingId ? "Edit Student" : "New Student"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            {!editingId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User ID
                </label>
                <input
                  type="text"
                  name="user"
                  required
                  value={formData.user}
                  onChange={handleChange}
                  placeholder="Paste the _id of the registered User"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  The student must already have a registered account (role: student).
                  Find their User ID in MongoDB. (We'll replace this with a dropdown
                  once a /api/users route exists.)
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Roll Number
              </label>
              <input
                type="text"
                name="rollNumber"
                required
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="CS2024001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
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
        <p className="text-gray-500">Loading students...</p>
      ) : students.length === 0 ? (
        <p className="text-gray-500">No students yet.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Roll No.</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Semester</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {student.rollNumber}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {student.user?.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {student.user?.email || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {student.department?.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{student.semester}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => openEditForm(student)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(student._id)}
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

export default Students;