import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const FacultyCourses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [facultyProfile, setFacultyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        // Step 1: find this user's Faculty record
        const facRes = await api.get("/faculty");
        const mine = facRes.data.faculty.find(
          (f) => f.user?._id === user.id || f.user?._id === user._id
        );

        if (!mine) {
          setError(
            "No faculty profile found for your account. Ask an admin to create one."
          );
          setLoading(false);
          return;
        }

        setFacultyProfile(mine);

        // Step 2: fetch courses and filter by same department
        const courseRes = await api.get("/courses");
        const deptCourses = courseRes.data.courses.filter(
          (c) => c.department?._id === mine.department?._id
        );
        setCourses(deptCourses);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
        {facultyProfile && (
          <p className="text-sm text-gray-500 mt-1">
            Department: {facultyProfile.department?.name} &nbsp;·&nbsp;{" "}
            {facultyProfile.designation}
          </p>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-gray-500">No courses found for your department.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                    {course.courseCode}
                  </p>
                  <h3 className="text-base font-semibold text-gray-800 mt-1">
                    {course.courseName}
                  </h3>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  Sem {course.semester}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                {course.credits} credits
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() =>
                    navigate("/faculty/attendance", {
                      state: { course },
                    })
                  }
                  className="flex-1 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                >
                  Mark Attendance
                </button>
                <button
                  onClick={() =>
                    navigate("/faculty/results", {
                      state: { course },
                    })
                  }
                  className="flex-1 py-1.5 text-xs font-medium bg-green-50 text-green-700 rounded hover:bg-green-100"
                >
                  Enter Results
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyCourses;