import { useEffect, useState } from "react";

import {
  getDepartments,
  createDepartment,
  deleteDepartment,
} from "../services/departmentService";

const Departments = () => {
  const [departments, setDepartments] = useState([]);

  const [name, setName] = useState("");
  const [hod, setHod] = useState("");
  const [description, setDescription] =
    useState("");

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();

      setDepartments(data.departments);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createDepartment({
        name,
        hod,
        description,
      });

      setName("");
      setHod("");
      setDescription("");

      fetchDepartments();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHandler = async (id) => {
    try {
      await deleteDepartment(id);

      fetchDepartments();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Departments</h1>

      <form onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="Department Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="HOD"
          value={hod}
          onChange={(e) =>
            setHod(e.target.value)
          }
        />

        <br />
        <br />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <br />
        <br />

        <button type="submit">
          Create Department
        </button>
      </form>

      <hr />

      {departments.map((dept) => (
        <div
          key={dept._id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>{dept.name}</h3>

          <p>HOD: {dept.hod}</p>

          <p>{dept.description}</p>

          <button
            onClick={() =>
              deleteHandler(dept._id)
            }
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Departments;