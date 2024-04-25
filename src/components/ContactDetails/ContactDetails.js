import { Container, Nav } from "react-bootstrap";
import classes from "./ContactDetails.module.css";
import { useRef } from "react";
import { useSelector } from "react-redux";

const ContactDetails = () => {
  const nameInputRef = useRef();
  const urlInputRef = useRef();
  const idToken = useSelector((state) => state.auth.token);

  const submitHandler = (event) => {
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
            <p className={classes.alignRight}>
              Your profile is 64% complete. A complete profile has higher chances
              of landing a job.{" "}
              <Nav.Link href="/contactde">Complete now</Nav.Link>
            </p>
          </div>
        </Container>
        <div className={classes.bottomBorder}></div>
      </div>
      <Container>
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
    </>
  );
};

export default ContactDetails;
