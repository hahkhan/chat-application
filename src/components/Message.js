import React from 'react';
import { auth } from '../firebase.js';
import Avatar from "../img/User-avatar.png";
import './Message.css';

const Message = ({ message }) => {
  const { text, uid, photoURL, displayName } = message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <>
      <div className={`message ${messageClass}`}>
        <div className='messageInfo'>
          <span>{displayName}</span>
          <img
            src={
              photoURL || Avatar
            }
            alt = ''
          />
        </div>
        <div className='messageText'>
          <p className='text'>{text}</p>
        </div>
      </div>
    </>
  );
};

export default Message;
