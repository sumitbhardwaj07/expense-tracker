import { useState } from "react";
import { useSelector } from "react-redux";

const VerifyEmailButton = () => {

  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const idToken = useSelector((state) => state.auth.token);
  

  const sendVerificationEmail = () => {
    setIsSending(true);
    setError(null);
    console.log(idToken);

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyChMLQ7MPabwzdBlznppnvx0u0ClzjW2Sc",
      {
        method: "POST",
        body: JSON.stringify({
          requestType: "VERIFY_EMAIL",
          idToken: idToken,
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
            let errorMessage = "Verification failed!";
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        console.log(data);
        alert("successfully verified");
      })
      .catch((err) => {
        alert(err.Message);
      });
      setIsSending(false);
  };

  return (
    <div>
      <button onClick={sendVerificationEmail} disabled={isSending}>
        {isSending ? "Sending..." : "Verify Email"}
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default VerifyEmailButton;
