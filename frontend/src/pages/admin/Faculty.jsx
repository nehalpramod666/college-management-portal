import { useState, useEffect } from "react";
import api from "../../api/axios";

const emptyForm = {
  user: "",
  employeeId: "",
  department: "",
  designation: "Assistant Professor",
};

const designationOptions = [
  "Assistant Professor",
  "Associate Professor",
  "Professor",
  "Head of Department",
];

const Faculty = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchFaculty = async () => {
    try {
      const res = await api.get("/faculty");
      setFacultyList(res.data.faculty);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load faculty");
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
    await Promise.all([fetchFaculty(), fetchDepartments()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openCreateForm = () => {
    if (departments.length === 0) {
      setError("Create a department first before adding faculty.");
      return;
    }
    setFormData({ ...emptyForm, department: departments[0]._id });
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (faculty) => {
    setFormData({
      user: faculty.user?._id || "",
      employeeId: faculty.employeeId,
      department: faculty.department?._id || "",
      designation: faculty.designation,
    });
    setEditingId(faculty._id);
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
        const { user, ...updateData } = formData;
        await api.put(`/faculty/${editingId}`, updateData);
      } else {
        await api.post("/faculty", formData);
      }
      await fetchFaculty();
      closeForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save faculty");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this faculty record? This cannot be undone.")) return;
    try {
      await api.delete(`/faculty/${id}`);
      await fetchFaculty();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete faculty");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Faculty</h1>
        <button
          onClick={openCreateForm}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          + Add Faculty
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
            {editingId ? "Edit Faculty" : "New Faculty"}
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
                  The faculty member must already have a registered account (role: faculty).
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee ID
              </label>
              <input
                type="text"
                name="employeeId"
                required
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="EMP2024001"
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
                  Designation
                </label>
                <select
                  name="designation"
                  required
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {designationOptions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
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
        <p className="text-gray-500">Loading faculty...</p>
      ) : facultyList.length === 0 ? (
        <p className="text-gray-500">No faculty yet.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Employee ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Designation</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {facultyList.map((faculty) => (
                <tr key={faculty._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {faculty.employeeId}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {faculty.user?.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {faculty.user?.email || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {faculty.department?.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{faculty.designation}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => openEditForm(faculty)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(faculty._id)}
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

export default Faculty;