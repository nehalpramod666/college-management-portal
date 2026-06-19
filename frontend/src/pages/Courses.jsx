import { useEffect, useState } from "react";

import {
  getCourses,
  createCourse,
  deleteCourse,
} from "../services/courseService";

import { getDepartments } from "../services/departmentService";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [courseCode, setCourseCode] =
    useState("");

  const [courseName, setCourseName] =
    useState("");

  const [credits, setCredits] =
    useState(4);

  const [semester, setSemester] =
    useState(1);

  const [department, setDepartment] =
    useState("");

  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data.courses);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data.departments);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchDepartments();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createCourse({
        courseCode,
        courseName,
        credits,
        semester,
        department,
      });

      setCourseCode("");
      setCourseName("");
      setCredits(4);
      setSemester(1);
      setDepartment("");

      fetchCourses();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHandler = async (id) => {
    try {
      await deleteCourse(id);
      fetchCourses();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Courses</h1>

      <form onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="Course Code"
          value={courseCode}
          onChange={(e) =>
            setCourseCode(e.target.value)
          }
        />

        <br /><br />

        <input
          type="text"
          placeholder="Course Name"
          value={courseName}
          onChange={(e) =>
            setCourseName(e.target.value)
          }
        />

        <br /><br />

        <input
          type="number"
          placeholder="Credits"
          value={credits}
          onChange={(e) =>
            setCredits(e.target.value)
          }
        />

        <br /><br />

        <input
          type="number"
          placeholder="Semester"
          value={semester}
          onChange={(e) =>
            setSemester(e.target.value)
          }
        />

        <br /><br />

        <select
          value={department}
          onChange={(e) =>
            setDepartment(e.target.value)
          }
        >
          <option value="">
            Select Department
          </option>

          {departments.map((dept) => (
            <option
              key={dept._id}
              value={dept._id}
            >
              {dept.name}
            </option>
          ))}
        </select>

        <br /><br />

        <button type="submit">
          Create Course
        </button>
      </form>

      <hr />

      {courses.map((course) => (
        <div
          key={course._id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>
            {course.courseCode} -{" "}
            {course.courseName}
          </h3>

          <p>
            Semester: {course.semester}
          </p>

          <p>
            Credits: {course.credits}
          </p>

          <p>
            Department:
            {" "}
            {course.department?.name}
          </p>

          <button
            onClick={() =>
              deleteHandler(course._id)
            }
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Courses;