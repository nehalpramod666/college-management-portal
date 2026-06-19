import { useEffect, useState } from "react";
import api from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get(
          "/dashboard/admin"
        );

        setStats(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <p>
        Students: {stats.totalStudents}
      </p>

      <p>
        Faculty: {stats.totalFaculty}
      </p>

      <p>
        Departments: {stats.totalDepartments}
      </p>

      <p>
        Courses: {stats.totalCourses}
      </p>
    </div>
  );
};

export default Dashboard;