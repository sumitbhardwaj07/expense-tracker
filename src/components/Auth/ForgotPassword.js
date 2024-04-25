import { useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { hideForgotPassword } from "../../store/authReducer";
import Modal from "../UI/Modal";
import styles from "./ForgotPassword.module.css"; // Import CSS module
import { useDispatch } from "react-redux";

const ForgotPassword = () => {
  const emailInputRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyChMLQ7MPabwzdBlznppnvx0u0ClzjW2Sc",
      {
        method: "POST",
        body: JSON.stringify({
          requestType: "PASSWORD_RESET",
          email: enteredEmail,
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
            let errorMessage = "Password reset failed. Please try again later.";
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        console.log(data.email);
        alert("An email has been sent to your email");
        dispatch(hideForgotPassword());
      })
      .catch((err) => {
        setErrorMessage(err.message);
      });
  };
  const handleClose = () => {
    dispatch(hideForgotPassword());
  };



  return (
    <Modal onClose={handleClose}>
      <form className={styles["form-container"]} onSubmit={submitHandler}>
        <h2>Forgot Password</h2>
        <div>
          <label htmlFor="forgotemail">Email:</label>
          <input
            id="forgotemail"
            type="email"
            required
            ref={emailInputRef}
            className={styles["input-field"]}
          />
          <Button variant="info" type="submit">
            Send link
          </Button>
        </div>
        {errorMessage && <p className={styles["error-message"]}>{errorMessage}</p>}
      </form>
    </Modal>
  );
};

export default ForgotPassword;