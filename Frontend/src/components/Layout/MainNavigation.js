import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authReducer";
import classes from "./MainNavigation.module.css";
import { Base_URL } from "../UI/Helper";

const MainNavigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const logoutHandler = async () => {
    try {
      await fetchWithRefreshToken(`${Base_URL}/api/v1/users/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Include the token here
        },
      });
      navigate("/auth");
      dispatch(logout());
    } catch (error) {
      console.error("Logout error:", error);
      // Optionally show error to the user
    }
  };

  const fetchWithRefreshToken = async (url, options) => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      console.error('No access token found');
      dispatch(logout());
      navigate("/auth");
      return;
    }

    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
    };

    const response = await fetch(url, options);

    // If the response indicates an expired token, try refreshing it
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        console.error('No refresh token found');
        dispatch(logout());
        navigate("/auth");
        return;
      }

      const refreshResponse = await fetch(`${Base_URL}/api/v1/users/refreshToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        localStorage.setItem('accessToken', data.accessToken); // Update access token
        options.headers['Authorization'] = `Bearer ${data.accessToken}`; // Retry original request
        return fetch(url, options); 
      } else {
        console.error("Failed to refresh token");
        dispatch(logout());
        navigate("/auth");
        return;
      }
    }

    return response;
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






// import { Link, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../../store/authReducer";
// import classes from "./MainNavigation.module.css";
// import { Base_URL } from "../UI/Helper";


// const MainNavigation = () => {
//   const dispatch = useDispatch()
  
//   const navigate = useNavigate();

//   const token = useSelector((state)=> state.auth.token);
//   console.log(token);


//   const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

//   const logoutHandler = async () => {
//     try {
//       const response = await fetch(`${Base_URL}/api/v1/users/logout`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`, // Include the token here
//         },
//         credentials: "include" // Ensures cookies are included in requests
//       });

//       if (response.ok) {
//         // Redirect to login page or display a message
//         //console.log("logout successfully")
//         navigate("/auth");
//         dispatch(logout());
//       } else {
//         console.error("Failed to log out");
//       }
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//     //dispatch(logout())
//   };
  
//   return (
//     <header className={classes.header}>
//       <Link to="/">
//         <div className={classes.logo}>Expense Tracker</div>
//       </Link>
//       <nav>
//         <ul>
//           {!isLoggedIn && (
//             <li>
//               <Link to="/auth">Login</Link>
//             </li>
//           )}
//           {isLoggedIn && (
//             <li>
//               <Link to="/">Home</Link>
//             </li>
//           )}
//           {isLoggedIn && (
//             <li>
//               <Link to="/profile">Profile</Link>
//             </li>
//           )}
//           {isLoggedIn && (
//             <li>
//               <button onClick={logoutHandler}>Logout</button>
//             </li>
//           )}
//         </ul>
//       </nav>
//     </header>
//   );
// };

// export default MainNavigation;
