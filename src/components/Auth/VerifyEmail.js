import { useState } from "react";

const VerifyEmailButton = () => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const idToken = localStorage.getItem("token");

  const sendVerificationEmail = () => {
    setIsSending(true);
    setError(null);

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
        setIsSending(false);
        alert("successfully verified");
      })
      .catch((err) => {
        alert(err.Message);
      });
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
