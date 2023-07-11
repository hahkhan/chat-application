import React, { useState, useRef } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useNavigate, Link } from 'react-router-dom';
import Avatar from "../img/User-avatar.png";
import './SignUp.css';

const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const fileRef = useRef();
  const navigate = useNavigate();

  const handleFileChange = () => {
    const file = fileRef.current.files[0];
    const avatarSrc = file ? URL.createObjectURL(file) : Avatar;
    const avatarImg = document.getElementById('avatar-img');
    avatarImg.src = avatarSrc;
  };
  

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const displayName = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const file = fileRef.current.files[0];

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      //Create a unique id for the image
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            navigate('/');
          } catch (err) {
            console.log(err);
            setErr(true);
            setLoading(false);
          }
        });
      });
    } catch (err) {
      setErr(true);
      setLoading(false);
    }
  };

  return (
    <div className='container'>
      <div className='wrapper'>
        <span className='title'>Sign Up</span>
        <form onSubmit={handleSubmit}>
          <input required type='text' placeholder='display name' ref={nameRef} />
          <input required type='email' placeholder='email' ref={emailRef}/>
          <input required type='password' placeholder='password' ref={passwordRef} />
          <input 
            style={{ display: 'none' }} 
            type='file'
            id='file' 
            ref={fileRef}
            onChange={handleFileChange} 
          />
          <label htmlFor='file'>
            <img id='avatar-img' src={Avatar} alt='' />
            <span>Add an avatar</span>
          </label>
          <button disabled={loading}>Sign up</button>
          {loading && 'Uploading and compressing the image please wait...'}
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          Have an account? <Link to='/login'>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
