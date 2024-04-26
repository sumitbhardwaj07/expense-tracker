import { Container, Nav } from "react-bootstrap";
import classes from "./ContactDetails.module.css";
import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../store/authReducer";

const ContactDetails = () => {
  const nameInputRef = useRef();
  const urlInputRef = useRef();
  const idToken = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    fetchUser();
  }, []);
  useEffect(() => {
    console.log("User data from Redux store:", userData); 
  }, [userData]);

  const fetchUser = async () => {
    
    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyChMLQ7MPabwzdBlznppnvx0u0ClzjW2Sc",
        {
          method: "POST",
          body: JSON.stringify({
            idToken: idToken,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      console.log("Data from API:", data);
      const userDataFromApi = data.users[0];
      dispatch(
        fetchUserData({
          name: userDataFromApi.displayName,
          email: userDataFromApi.email,
          photoUrl: userDataFromApi.photoUrl,
        })
      );
      console.log("User data from Redux store:", userData);
      alert("Fetched successfully");
      // Pre-fill input fields with user data
      
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const enteredName = nameInputRef.current.value;
    const enteredUrl = urlInputRef.current.value;

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyChMLQ7MPabwzdBlznppnvx0u0ClzjW2Sc",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: idToken,
          displayName: enteredName,
          photoUrl: enteredUrl,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Update failed!";
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
      
        console.log(data);
        dispatch(
          fetchUserData({
            name: data.displayName,
            email: data.email,
            photoUrl: data.photoUrl,
          })
        );
        alert("Updated successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <div className={classes.underline}>
        <Container>
          <div className={classes.flexContainer}>
            <p>Winners never quit, quitters never win.</p>
            {userData ? (
              <p>Your profile is complete.</p>
            ) : (
              <p>
                Your profile is incomplete.{" "}
                <Nav.Link href="/contactde">Complete now</Nav.Link>
              </p>
            )}
          </div>
        </Container>
        <div className={classes.bottomBorder}></div>
      </div>
      <Container className={classes.contactContainer}>
        <h2>Contact Details</h2>
        <form onSubmit={submitHandler} className={classes.form}>
          <div className={classes.formGroup}>
            <label htmlFor="fullname">Full Name:</label>
            <input
              id="fullname"
              type="text"
              required
              ref={nameInputRef}
              className={classes.input}
              defaultValue={userData ? userData.name : ""}
            />
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="photo">Profile Photo URL:</label>
            <input
              id="photo"
              type="url"
              required
              ref={urlInputRef}
              className={classes.input}
              defaultValue={userData ? userData.photoUrl : ""}
              
            />
          </div>
          <div className={classes.buttonGroup}>
            <button type="submit" className={classes.submitButton}>
              Update
            </button>
            <button type="button" className={classes.closeButton}>
              Close
            </button>
          </div>
        </form>
      </Container>
      <Container>
        {userData && (
          <div className={classes.successMessage}>
            <p>Updated successfully!</p>
            <p>
              <strong>Full Name:</strong> {userData.name}
            </p>
            <p>
              <strong>Profile Photo URL:</strong> {userData.photoUrl}
            </p>
            <p>
              <strong>Email Id:</strong> {userData.email}
            </p>
          </div>
        )}
      </Container>
    </>
  );
};

export default ContactDetails;
