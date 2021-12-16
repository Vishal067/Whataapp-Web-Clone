import { Avatar } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import db from './firebase'
import './SidebarChat.css'
import { Link } from 'react-router-dom';
// import { Avatar } from '@material-ui/icons';


function SidebarChat ({ id, name, addNewChat }) {
  const [seed, setSeed] = useState('');
  const [messages, setMessages] = useState("");
// console.log('add new chat',messages)
  useEffect(() => {
    if (id) {
        db.collection('rooms').doc(id).collection('messages').orderBy("timestamp","desc").onSnapshot((snapshot) => 
            setMessages(snapshot.docs.map((doc) => doc.data()))
        )
    }
}, [id]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000))
  }, [])

  const createChat = () => {
    const roomName = prompt('Please Enter Name for Chat room')
    if (roomName) {
      db.collection('rooms').add({
        name: roomName
      })
    }
  }

  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
    <div className='sidebarChat'>
      <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
      <div className='sidebarChat__info'>
        <h4>{name}</h4>
        <p>{messages[0]?.message}</p>
      </div>
    </div>
    </Link>
  ) : (
    <div onClick={createChat} className='sidebarChat'>
      <h3>Add New Chat</h3>
    </div>
  )
}

export default SidebarChat
