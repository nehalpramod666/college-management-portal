import { useEffect, useState } from "react";
import {
  getResults,
  createResult,
} from "../services/resultService";

const Results = () => {
  const [results, setResults] = useState([]);

  const [student, setStudent] = useState("");
  const [course, setCourse] = useState("");
  const [marks, setMarks] = useState("");

  const fetchResults = async () => {
    try {
      const data = await getResults();
      setResults(data.results);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createResult({
        student,
        course,
        marks,
      });

      setStudent("");
      setCourse("");
      setMarks("");

      fetchResults();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Results</h1>

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
          type="number"
          placeholder="Marks"
          value={marks}
          onChange={(e) =>
            setMarks(e.target.value)
          }
        />

        <br /><br />

        <button type="submit">
          Save Result
        </button>
      </form>

      <hr />

      {results.map((result) => (
        <div
          key={result._id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p>
            Student:
            {" "}
            {result.student?.rollNumber}
          </p>

          <p>
            Course:
            {" "}
            {result.course?.courseName}
          </p>

          <p>
            Marks:
            {" "}
            {result.marks}
          </p>

          <p>
            Grade:
            {" "}
            {result.grade}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Results;