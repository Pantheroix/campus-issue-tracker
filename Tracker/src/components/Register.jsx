import { Link } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const [Rdata, setRdata] = useState({
    uname: "",
    uemail: "",
    urole: "Student",
    upassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerMessage, setRegisterMessage] = useState("");
  const [registerError, setRegisterError] = useState("");

  const HandelSubmit = async (event) => {
    event.preventDefault();
    const api = "http://localhost:3000/api/register";
    setIsSubmitting(true);
    setRegisterError("");
    setRegisterMessage("");

    try {
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Rdata),
      });
      const data = await response.json();

      if (response.ok) {
        console.log(data.message);
        setRegisterMessage(
          "Account created successfully. You can now sign in.",
        );
        setRdata({
          uname: "",
          uemail: "",
          urole: "Student",
          upassword: "",
        });
      } else {
        setRegisterError(data.message || "Unable to create account right now.");
      }
    } catch (err) {
      console.log(err);
      setRegisterError("Something went wrong while creating your account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const Handelchange = (event) => {
    const { id, value } = event.target;
    setRdata((prevdata) => ({
      ...prevdata,
      [id]: value,
    }));
  };

  return (
    <div className="page-shell auth-page">
      <div className="auth-card auth-card--wide">
        <div className="auth-card__header">
          <p className="eyebrow">New here?</p>
          <h1>Create your campus account</h1>
        </div>

        <form className="auth-form" onSubmit={HandelSubmit}>
          <div className="field-row">
            <div className="field-group">
              <label htmlFor="uname">Full name</label>
              <input
                type="text"
                id="uname"
                value={Rdata.uname}
                onChange={Handelchange}
                placeholder="Your full name"
              />
            </div>

            <div className="field-group">
              <label htmlFor="urole">Role</label>
              <select
                name="Role"
                id="urole"
                value={Rdata.urole}
                onChange={Handelchange}
              >
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
              </select>
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="uemail">Email address</label>
            <input
              type="email"
              id="uemail"
              value={Rdata.uemail}
              onChange={Handelchange}
              placeholder="name@campus.edu"
            />
          </div>

          <div className="field-group">
            <label htmlFor="upassword">Password</label>
            <input
              type="password"
              id="upassword"
              value={Rdata.upassword}
              onChange={Handelchange}
              placeholder="Create a password"
            />
          </div>

          {registerMessage && (
            <div className="form-message form-message--success">
              {registerMessage}
            </div>
          )}
          {registerError && (
            <div className="form-message form-message--error">
              {registerError}
            </div>
          )}

          <button
            type="submit"
            className="primary-btn full-width"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Register"}
          </button>

          <p className="auth-link-row">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
