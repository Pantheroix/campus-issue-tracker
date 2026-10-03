import { Link } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const [Rdata, setRdata] = useState({
    uname: "",
    uemail: "",
    urole: "Student",
    upassword: "",
  });
  const HandelSubmit = async (event) => {
    event.preventDefault();
    const api = "http://localhost:3000/api/register";

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
      }
    } catch (err) {
      console.log(err);
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
    <>
      <div className="Rform">
        <div>
          <form onSubmit={HandelSubmit}>
            <label htmlFor="Name">Enter your Name:</label>
            <br />
            <input
              type="text"
              id="uname"
              value={Rdata.uname}
              onChange={Handelchange}
            />
            <br />
            <label htmlFor="Email">Enter your Email id:</label>
            <br />
            <input
              type="email"
              id="uemail"
              value={Rdata.uemail}
              onChange={Handelchange}
            />
            <br />
            <label htmlFor="role">Enter your Role:</label>
            <br />
            <select
              name="Role"
              id="urole"
              value={Rdata.urole}
              onChange={Handelchange}
            >
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
            </select>
            <br />
            <label htmlFor="password">Create a password:</label>
            <br />
            <input
              type="password"
              id="upassword"
              value={Rdata.upassword}
              onChange={Handelchange}
            />
            <br />
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}
