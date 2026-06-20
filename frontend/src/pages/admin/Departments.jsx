import { useState, useEffect } from "react";
import api from "../../api/axios";

const emptyForm = { name: "", description: "", hod: "" };

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/departments");
      setDepartments(res.data.departments);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (dept) => {
    setFormData({
      name: dept.name,
      description: dept.description || "",
      hod: dept.hod || "",
    });
    setEditingId(dept._id);
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
        await api.put(`/departments/${editingId}`, formData);
      } else {
        await api.post("/departments", formData);
      }
      await fetchDepartments();
      closeForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save department");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this department? This cannot be undone.")) return;
    try {
      await api.delete(`/departments/${id}`);
      await fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete department");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Departments</h1>
        <button
          onClick={openCreateForm}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          + Add Department
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}

      {/* Create/Edit form */}
      {showForm && (
        <div className="mb-6 p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Department" : "New Department"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Head of Department
              </label>
              <input
                type="text"
                name="hod"
                value={formData.hod}
                onChange={handleChange}
                placeholder="Not Assigned"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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

      {/* Table */}
      {loading ? (
        <p className="text-gray-500">Loading departments...</p>
      ) : departments.length === 0 ? (
        <p className="text-gray-500">No departments yet.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">HOD</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {departments.map((dept) => (
                <tr key={dept._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {dept.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {dept.description || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{dept.hod}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => openEditForm(dept)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dept._id)}
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

export default Departments;