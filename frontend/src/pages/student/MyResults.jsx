import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const gradeColor = (grade) => {
  if (!grade) return "text-gray-500";
  if (grade === "O") return "text-purple-600";
  if (grade === "A+") return "text-blue-600";
  if (grade === "A") return "text-green-600";
  if (grade === "B+") return "text-teal-600";
  if (grade === "B") return "text-yellow-600";
  if (grade === "C") return "text-orange-600";
  return "text-red-600";
};

const MyResults = () => {
  const { user } = useAuth();

  const [results, setResults] = useState([]);
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

        // Step 2: fetch results for this student
        const resRes = await api.get(`/results/student/${mine._id}`);
        setResults(resRes.data.results);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load results");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Summary stats
  const total = results.length;
  const average =
    total > 0
      ? Math.round(results.reduce((sum, r) => sum + r.marks, 0) / total)
      : null;
  const highest = total > 0 ? Math.max(...results.map((r) => r.marks)) : null;
  const lowest = total > 0 ? Math.min(...results.map((r) => r.marks)) : null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Results</h1>
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
      {!loading && !error && total > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 font-medium">Average Marks</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{average}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 font-medium">Highest</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{highest}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 font-medium">Lowest</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{lowest}</p>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading results...</p>
      ) : results.length === 0 ? (
        <p className="text-gray-500">No results found yet.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Course Code</th>
                <th className="px-4 py-3">Course Name</th>
                <th className="px-4 py-3">Credits</th>
                <th className="px-4 py-3">Marks</th>
                <th className="px-4 py-3">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {results.map((result) => (
                <tr key={result._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {result.course?.courseCode || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {result.course?.courseName || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {result.course?.credits || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-800 font-medium">
                    {result.marks}
                    <span className="text-gray-400 font-normal"> / 100</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm font-bold ${gradeColor(result.grade)}`}
                    >
                      {result.grade || "—"}
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

export default MyResults;