import { useRef } from 'react';
import classes from './ProfileForm.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/authReducer';
const ProfileForm = () => {
  const newPasswordInputRef = useRef();
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const submitHandler = (event) =>{
    event.preventDefault();
    

    const enteredNewPassword = newPasswordInputRef.current.value;
  
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyChMLQ7MPabwzdBlznppnvx0u0ClzjW2Sc',{
      method: 'POST',
      body: JSON.stringify({
        idToken: token,
        password: enteredNewPassword,
        returnSecureToken: false
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return res.json().then((data) => {
          let errorMessage = "password update failed!";
          throw new Error(errorMessage);
        });
      }
    })
    .then((data) => {
      dispatch(login({ token: data.idToken, userId: data.localId }));
      alert("password has been updated successfully");
    })
    .catch((err) => {
      alert(err.Message);
    });
  };
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength="6" ref={newPasswordInputRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
