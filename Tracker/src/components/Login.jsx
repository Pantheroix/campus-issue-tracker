import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [Ldata, setLdata] = useState({
    uemail: "",
    upassword: "",
  });
  const HandelSubmit = async function (e) {
    e.preventDefault();
    const api = "http://localhost:3000/api/login";

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
      }
    } catch (err) {
      console.log(err);
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
    <>
      <div className="Mlogind">
        <form>
          <label htmlFor="email">Enter your Email id:</label>
          <br />
          <input
            type="email"
            id="uemail"
            onChange={HandelChange}
            value={Ldata.uemail}
          />
          <br />
          <label htmlFor="password">Enter your password:</label>
          <br />
          <input
            type="password"
            id="upassword"
            value={Ldata.upassword}
            onChange={HandelChange}
          />
          <br />
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
          <br />
          <button onClick={HandelSubmit}> Submit</button>
        </form>
      </div>
    </>
  );
}
