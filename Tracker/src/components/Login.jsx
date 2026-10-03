import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [Ldata, setLdata] = useState({
    uemail: "",
    upassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");

  const HandelSubmit = async function (e) {
    e.preventDefault();
    const api = "http://localhost:3000/api/login";
    setIsSubmitting(true);
    setLoginError("");

    try {
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Ldata),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message, data.token, data.payload);

        if (data.payload.role == "Student") {
          navigate("/issue", {
            state: data.payload,
          });
        }
        if (data.payload.role == "Teacher") {
          navigate("/tpge", {
            state: data.payload,
          });
        }
        localStorage.setItem("token", data.token);
      } else {
        setLoginError(
          data.message || "Login failed. Please check your credentials.",
        );
      }
    } catch (err) {
      console.log(err);
      setLoginError("Unable to sign in right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const HandelChange = (event) => {
    const { id, value } = event.target;
    setLdata((prevdata) => ({
      ...prevdata,
      [id]: value,
    }));
  };

  return (
    <div className="page-shell auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <p className="eyebrow">Welcome back</p>
          <h1>Login to your account</h1>
        </div>

        <form className="auth-form" onSubmit={HandelSubmit}>
          <div className="field-group">
            <label htmlFor="uemail">Email address</label>
            <input
              type="email"
              id="uemail"
              onChange={HandelChange}
              value={Ldata.uemail}
              placeholder="name@campus.edu"
            />
          </div>

          <div className="field-group">
            <label htmlFor="upassword">Password</label>
            <input
              type="password"
              id="upassword"
              value={Ldata.upassword}
              onChange={HandelChange}
              placeholder="Enter your password"
            />
          </div>

          {loginError && (
            <div className="form-message form-message--error">{loginError}</div>
          )}

          <button
            type="submit"
            className="primary-btn full-width"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>

          <p className="auth-link-row">
            Don&apos;t have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
