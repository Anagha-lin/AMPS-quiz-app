import React, { useState } from "react";

const Login = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [className, setClassName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!name || !studentId || !className) {
      alert("Please fill in all fields");
      return;
    }

    const studentData = {
      name,
      studentId,
      className,
    };

    // Optional: store locally (useful later)
    localStorage.setItem("student", JSON.stringify(studentData));

    // Move to quiz
    onSuccess(studentData);
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Student Login</h2>

        <input
          style={styles.input}
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          style={styles.input}
          type="text"
          placeholder="Student ID (e.g. AMP001)"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />

        <input
          style={styles.input}
          type="text"
          placeholder="Class (e.g. Primary 6)"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />

        <button style={styles.button} type="submit">
          Continue to Quiz
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    fontFamily: "Arial, sans-serif",
  },
  form: {
    background: "#1e293b",
    padding: "40px",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "400px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  title: {
    color: "#fff",
    textAlign: "center",
    marginBottom: "10px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#fff",
    outline: "none",
  },
  button: {
    padding: "12px",
    background: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Login;
