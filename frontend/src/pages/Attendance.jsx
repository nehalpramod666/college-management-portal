import { useEffect, useState } from "react";

import {
  getAttendance,
  markAttendance,
} from "../services/attendanceService";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);

  const [student, setStudent] = useState("");
  const [course, setCourse] = useState("");
  const [markedBy, setMarkedBy] = useState("");
  const [status, setStatus] =
    useState("Present");

  const fetchAttendance = async () => {
    try {
      const data = await getAttendance();
      setAttendance(data.attendance);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await markAttendance({
        student,
        course,
        markedBy,
        status,
        date: new Date(),
      });

      setStudent("");
      setCourse("");
      setMarkedBy("");
      setStatus("Present");

      fetchAttendance();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Attendance</h1>

      <form onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="Student ID"
          value={student}
          onChange={(e) =>
            setStudent(e.target.value)
          }
        />

        <br /><br />

        <input
          type="text"
          placeholder="Course ID"
          value={course}
          onChange={(e) =>
            setCourse(e.target.value)
          }
        />

        <br /><br />

        <input
          type="text"
          placeholder="Faculty ID"
          value={markedBy}
          onChange={(e) =>
            setMarkedBy(e.target.value)
          }
        />

        <br /><br />

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option value="Present">
            Present
          </option>

          <option value="Absent">
            Absent
          </option>
        </select>

        <br /><br />

        <button type="submit">
          Mark Attendance
        </button>
      </form>

      <hr />

      {attendance.map((record) => (
        <div
          key={record._id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p>
            Student:
            {" "}
            {record.student?.rollNumber}
          </p>

          <p>
            Course:
            {" "}
            {record.course?.courseName}
          </p>

          <p>
            Status:
            {" "}
            {record.status}
          </p>

          <p>
            Date:
            {" "}
            {new Date(
              record.date
            ).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Attendance;