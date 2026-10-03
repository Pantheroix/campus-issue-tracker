import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  function Pregister() {
    navigate("/register");
  }

  function Plogin() {
    navigate("/login");
  }

  return (
    <>
      <div className="home">
        <div>This the Home Page</div>
        <button onClick={Pregister}>Register</button>
        <button onClick={Plogin}>Login</button>
      </div>
    </>
  );
}
