import React from "react";

const Landing = ({ goToLogin }) => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Anagha Modern Preparatory Schools</h1>

        <p style={styles.motto}>Discipline and Knowledge</p>

        <div style={styles.infoBox}>
          <h3>Computer Based Test (CBT)</h3>
          <ul style={styles.list}>
            <li>✔ Timed Examination</li>
            <li>✔ One Attempt Only</li>
            <li>✔ Instant Result Display</li>
            <li>✔ Secure Student Login</li>
          </ul>
        </div>

        <button style={styles.button} onClick={goToLogin}>
          Start Quiz
        </button>
      </div>
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
    color: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "#1e293b",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center",
    width: "90%",
    maxWidth: "500px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  },
  title: {
    fontSize: "24px",
    marginBottom: "10px",
  },
  motto: {
    fontStyle: "italic",
    color: "#94a3b8",
    marginBottom: "20px",
  },
  infoBox: {
    textAlign: "left",
    marginBottom: "20px",
    background: "#0f172a",
    padding: "15px",
    borderRadius: "8px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    lineHeight: "1.8",
  },
  button: {
    padding: "12px 20px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Landing;
