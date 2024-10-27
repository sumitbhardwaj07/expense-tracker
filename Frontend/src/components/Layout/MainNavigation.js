import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authReducer";
import classes from "./MainNavigation.module.css";


const MainNavigation = () => {
  const dispatch = useDispatch()
  
  const navigate = useNavigate();

  const token = useSelector((state)=> state.auth.token);


  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  const logoutHandler = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Include the token here
        },
        credentials: "include" // Ensures cookies are included in requests
      });

      if (response.ok) {
        // Redirect to login page or display a message
        //console.log("logout successfully")
        navigate("/auth");
        dispatch(logout());
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
    //dispatch(logout())
  };
  
  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>Expense Tracker</div>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn && (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <Link to="/">Home</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
