import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        data.token
      );

      navigate("/dashboard");
    } catch (error) {
  console.log("ERROR OBJECT:", error);
  console.log("BACKEND RESPONSE:", error.response?.data);
  console.log("STATUS:", error.response?.status);

  alert(error.response?.data?.message || "Login Failed");
}
  };

  return (
    <form onSubmit={submitHandler}>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <br /><br />

      <button type="submit">
        Login
      </button>
    </form>
  );
};

export default Login;