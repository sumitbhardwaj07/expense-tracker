import { useState } from "react";
import { useSelector } from "react-redux";

const VerifyEmailButton = () => {

  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const idToken = useSelector((state) => state.auth.token);
  

  const sendVerificationEmail = async () => {
    setIsSending(true);
    setError(null);
  
    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=YOUR_API_KEY",
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
      );
  
      if (!response.ok) {
        const data = await response.json();
        let errorMessage = "Verification failed!";
        if (data && data.error && data.error.message) {
          errorMessage = data.error.message;
        }
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
      console.log(data);
      alert("Successfully verified");
    } catch (error) {
      setError(error.message);
    }
  
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
