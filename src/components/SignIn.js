import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './SignIn.css';
import { auth } from '../firebase';

const SignIn = () => {
  const [err, setErr] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      console.log(err);
      setErr(true);
    }
  };
  return (
    <div className='container'>
      <div className='wrapper'>
        <span className='title'>Sign In</span>
        <form onSubmit={handleSubmit}>
          <input ref={emailRef} type='email' placeholder='email' />
          <input ref={passwordRef} type='password' placeholder='password' />
          <button>Sign in</button>
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          don't have an account? <Link to='/signup'>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
