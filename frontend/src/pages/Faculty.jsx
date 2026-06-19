import { useEffect, useState } from "react";

import {
  getFaculty,
  createFaculty,
  deleteFaculty,
} from "../services/facultyService";

import { getDepartments } from "../services/departmentService";

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [user, setUser] = useState("");
  const [employeeId, setEmployeeId] =
    useState("");
  const [department, setDepartment] =
    useState("");
  const [designation, setDesignation] =
    useState("");

  const fetchFaculty = async () => {
    try {
      const data = await getFaculty();
      setFaculty(data.faculty);
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
    fetchFaculty();
    fetchDepartments();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createFaculty({
        user,
        employeeId,
        department,
        designation,
      });

      setUser("");
      setEmployeeId("");
      setDepartment("");
      setDesignation("");

      fetchFaculty();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHandler = async (id) => {
    try {
      await deleteFaculty(id);
      fetchFaculty();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Faculty</h1>

      <form onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="User ID"
          value={user}
          onChange={(e) =>
            setUser(e.target.value)
          }
        />

        <br /><br />

        <input
          type="text"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) =>
            setEmployeeId(e.target.value)
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
          type="text"
          placeholder="Designation"
          value={designation}
          onChange={(e) =>
            setDesignation(e.target.value)
          }
        />

        <br /><br />

        <button type="submit">
          Create Faculty
        </button>
      </form>

      <hr />

      {faculty.map((teacher) => (
        <div
          key={teacher._id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>
            {teacher.user?.name}
          </h3>

          <p>
            Employee ID:
            {" "}
            {teacher.employeeId}
          </p>

          <p>
            Department:
            {" "}
            {teacher.department?.name}
          </p>

          <p>
            Designation:
            {" "}
            {teacher.designation}
          </p>

          <button
            onClick={() =>
              deleteHandler(teacher._id)
            }
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Faculty;