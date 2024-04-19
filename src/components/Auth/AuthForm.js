import { useContext, useRef, useState } from "react";
import classes from "./AuthForm.module.css";
import AuthContext from "../../store/auth-context";
import ForgotPassword from "./ForgotPassword";

const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };
  const forgotPasswordHandler = () => {
    setShowForgotPassword(true);
  };
  const closeForgotPasswordHandler = () =>{
    setShowForgotPassword(false);
  }

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredConfirmedPassword = confirmPasswordInputRef.current.value;

    if (!isLogin && enteredPassword !== enteredConfirmedPassword) {
      alert("Passwords do not match.");
      return;
    }

  
    setIsLoading(true);
    let url;
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyChMLQ7MPabwzdBlznppnvx0u0ClzjW2Sc";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyChMLQ7MPabwzdBlznppnvx0u0ClzjW2Sc";
    }
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Authentication failed!";
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        authCtx.login(data.idToken);
      })
      .catch((err) => {
        alert(err.Message);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            required
            ref={confirmPasswordInputRef}
            onChange={(event) => setEnteredConfirmPassword(event.target.value)}
          />
        </div>
        <div>
        <button
            type="button"
            className={classes.toggle}
            onClick={forgotPasswordHandler}
          >
            Forgot password?
          </button>
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p>Sending request...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>

      {showForgotPassword && <ForgotPassword onClose={closeForgotPasswordHandler}/>}
    </section>
  );
};

export default AuthForm;
