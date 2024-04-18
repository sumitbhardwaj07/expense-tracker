import { Container, Modal, Nav } from "react-bootstrap";
import classes from "./ContactDetails.module.css";
import { useRef } from "react";
const ContactDetails = () => {

  const nameInputRef = useRef();
  const urlInputRef = useRef();
  

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredName = nameInputRef.current.value;
    const enteredUrl = urlInputRef.current.value;
    const idToken = localStorage.getItem('token');
  

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
            //if(data && data.error.message) {
            //  errorMessage = data.error.message;
            //}
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        
        alert("updated successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Modal show={true}>
      <div className={classes.underline}>
        <Container>
          <div className={classes.flexContainer}>
            <p>Winners never quite, Quitters never win.</p>
            <p className={classes.alignRight}>
              Your Profile is 64% completed. A complete Profile has higher
              chances of landig a job.{" "}
              <Nav.Link href="/cotactde">Complete now</Nav.Link>
            </p>
          </div>
        </Container>
        <div className={classes.bottomBorder}></div>
      </div>
      <Container>
        <h2>Contact Details</h2>
        <form onSubmit={submitHandler}> 
          <label htmlFor="fullname">Full Name: </label>
          <input id="fullname" type="text" required ref={nameInputRef} />
          <label htmlFor="photo">Profile Photo URL</label>
          <input id="photo" type="url" required ref={urlInputRef} />
          <button>Update</button>
          <button>Close</button>
        </form>
      </Container>
    </Modal>
  );
};

export default ContactDetails;
