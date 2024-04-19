import { useRef } from "react";
import { Button, Modal } from "react-bootstrap";

const ForgotPassword = ({onClose}) => {
  const emailInputRef = useRef(null);


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
            let errorMessage = "reset failed!";
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        console.log(data.email);
        alert("email sent to your email");
        onClose();
      })
      .catch((err) => {
        alert(err.Message);
      });
  
  };

  return (
    <Modal show={true}>
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="forgotemail">Email:</label>
          <input id="forgotemail" type="email" required ref={emailInputRef} />
          <Button variant="info" type="submit">send link</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ForgotPassword;