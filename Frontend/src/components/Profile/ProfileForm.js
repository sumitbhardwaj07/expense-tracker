import { useRef } from 'react';
import classes from './ProfileForm.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/authReducer';
import { Base_URL } from '../UI/Helper';
const ProfileForm = () => {
  const newPasswordInputRef = useRef();
  const currentPassInputRef = useRef();
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();


  const submitHandler = async (event) => {
    event.preventDefault();
    const currentpassword = currentPassInputRef.current.value;
    const newpassword = newPasswordInputRef.current.value;
    
  
    try {
      const response = await fetch(`${Base_URL}/api/v1/users/changepassword`, {
        method: 'POST',
        body: JSON.stringify({
          currentpassword,
          newpassword
        }),
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
        
      });
  
      if (!response.ok) {
        const data = await response.json();
        let errorMessage = "Password update failed!";
        if (data && data.error && data.error.message) {
          errorMessage = data.error.message;
        }
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
      dispatch(login({ token: data.idToken, userId: data.localId }));
      alert("Password has been updated successfully");
    } catch (error) {
      alert(error.message);
    }
  };
  
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='current-password'>Current Password</label>
        <input type='password' id='current-password' minLength="6" ref={currentPassInputRef} />
      </div>
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
