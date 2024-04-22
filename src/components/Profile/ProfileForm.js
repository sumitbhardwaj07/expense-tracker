import { useRef } from 'react';
import classes from './ProfileForm.module.css';
import { useSelector } from 'react-redux';

const ProfileForm = () => {
  const newPasswordInputRef = useRef();
  const token = useSelector(state => state.auth.token);

  const submitHandler = (event) =>{
    event.preventDefault();

    const enteredNewPassword = newPasswordInputRef.current.value;
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBFJ2PbK-JDmex-oUwfhceDbZrZwclW3T4',{
      method: 'POST',
      body: JSON.stringify({
        idToken: token,
        password: enteredNewPassword,
        returnSecureToken: false
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {

    });
  };
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength="7" ref={newPasswordInputRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
