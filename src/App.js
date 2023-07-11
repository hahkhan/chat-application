import React, { useState } from 'react';
import './App.css';
import { auth } from './firebase.js';
import { useAuthState } from 'react-firebase-hooks/auth';
import SignIn from './components/SignIn.js';
import MainChat from './components/MainChat.js';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp.js';

function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const [user] = useAuthState(auth);

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to='/login' />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'>
          <Route
            index
            element={
              <ProtectedRoute>
                <div className={`app ${theme}`} >
                  <header>
                    <span class='emoji'>💬</span>
                    <div>
                      <span className="theme-toggle emoji" onClick={toggleTheme}>
                        {theme === 'light' ? '☽' : '☀'}
                      </span>
                      <SignOut />
                    </div>
                  </header>
                  <MainChat />
                </div>
              </ProtectedRoute>
            }
          />
          <Route path='login' element={<SignIn />} />
          <Route path='signup' element={<SignUp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className='sign-out' onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  );
}

export default App;
