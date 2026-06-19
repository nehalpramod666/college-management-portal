import { useEffect, useState } from "react";
import {
  getStudents,
  createStudent,
  deleteStudent,
} from "../services/studentService";

import { getDepartments } from "../services/departmentService";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [user, setUser] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState(1);

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data.students);
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
    fetchStudents();
    fetchDepartments();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!user || !department || !rollNumber) {
      alert("Please fill all fields correctly");
      return;
  }
    try {
      await createStudent({
        user,
        rollNumber,
        department,
        semester,
      });

      setUser("");
      setRollNumber("");
      setDepartment("");
      setSemester(1);

      fetchStudents();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHandler = async (id) => {
    try {
      await deleteStudent(id);
      fetchStudents();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Students</h1>

      <form onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="User ID"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Roll Number"
          value={rollNumber}
          onChange={(e) =>
            setRollNumber(e.target.value)
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

        <input
          type="number"
          value={semester}
          onChange={(e) =>
            setSemester(e.target.value)
          }
        />

        <br /><br />

        <button type="submit">
          Create Student
        </button>
      </form>

      <hr />

      {students.map((student) => (
        <div
          key={student._id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>
            {student.user?.name}
          </h3>

          <p>
            Roll No:
            {" "}
            {student.rollNumber}
          </p>

          <p>
            Department:
            {" "}
            {student.department?.name}
          </p>

          <p>
            Semester:
            {" "}
            {student.semester}
          </p>

          <button
            onClick={() =>
              deleteHandler(student._id)
            }
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Students;