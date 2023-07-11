import React, { useRef, useState } from 'react';
import { auth, db } from '../firebase.js';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/compat/app';
import Message from './Message.js';
import './MainChat.css';
const MainChat = () => {
  const dummy = useRef();
  const messagesRef = db.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL, displayName } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      displayName,
    });

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <main>
        {messages &&
          messages.map((msg) => <Message key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <form className='formContainer' onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder='Enter Your Message'
        />

        <button type='submit' disabled={!formValue}>
          Send !
        </button>
      </form>
    </div>
  );
};

export default MainChat;
