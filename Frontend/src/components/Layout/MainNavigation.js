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
          "Authorization": `Bearer ${token}`,
        },
      });
      navigate("/auth");
      dispatch(logout());
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const fetchWithRefreshToken = async (url, options) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
      };
    }

    const response = await fetch(url, options);

    // If the response indicates an expired token, try refreshing it
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      const refreshResponse = await fetch(`${Base_URL}/api/v1/users/refresh-token`, {
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
        return fetch(url, options); // Retry the original request
      } else {
        // Handle refresh token failure (e.g., redirect to login)
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
