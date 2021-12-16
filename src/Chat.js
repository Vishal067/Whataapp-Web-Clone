
import { Avatar, Button, IconButton } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { AttachFile, MoreVert, SearchOutlined } from '@material-ui/icons'
import MicIcon from '@material-ui/icons/Mic'
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon'
import './Chat.css'
import { useParams } from 'react-router-dom'
import db from './firebase'
import firebase from 'firebase'
import { useStateValue } from './StateProvider'
import SendIcon from '@material-ui/icons/Send';
import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';

function Chat () {
  const [input, setInput] = useState('')
  const [seed, setSeed] = useState('')
  const { roomId } = useParams()
  const [roomName, setRoomName] = useState('')
  const [messages, setMesssages] = useState([])
  const [{ user }, dispatch] = useStateValue()
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [emoji, setEmoji] = useState(false)

  const onEmojiClick = (event, emojiObject) => {
    console.log(emojiObject)
    setChosenEmoji(emojiObject.emoji);
    setInput(emojiObject.emoji)
  };

  useEffect(() => {
    if (roomId) {
      db.collection('rooms')
        .doc(roomId)
        .onSnapshot(snapshot => setRoomName(snapshot.data().name))

      db.collection('rooms')
        .doc(roomId)
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .onSnapshot(snapshot =>
          setMesssages(snapshot.docs.map(doc => doc.data()))
        )
    }
  }, [roomId])

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000))
  }, [roomId])

  const sendMessage = e => {
    e.preventDefault()
    setEmoji (false);
    console.log('you typed >>>', input)
    db.collection('rooms')
      .doc(roomId)
      .collection('messages')
      .add({
        message: input,
        name: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
    setInput('')
  }

  return (
    <div className='chat'>
      <div className='chat__header'>
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />

        <div className='chat__headerInfo'>
          <h3>{roomName}</h3>
          <p>
            Last seen{' '}
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toUTCString()}
          </p>
        </div>
        <div className='chat__headerRight'>
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className='chat__body'>
        {messages.map(message => (
          <p
            className={`chat__message ${message.name === user.displayName &&
              'chat__reciever'}`}
          >
            <span className='chat__name'>{message.name}</span>
            {message.message}
            <span className='chat__timestamp'>
              {new Date(message.timestamp?.toDate()).toUTCString()}
            </span>
          </p>
        ))}
      </div>
      {
emoji ?
<div className='emoji'>
        <Picker onEmojiClick={onEmojiClick} native />
        </div>
        :
        null
        }
      <div className='chat__footer'>
      <IconButton>
        <InsertEmoticonIcon onClick={()=>setEmoji(!emoji)} />
        </IconButton>
       
        <form>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder='Type a message'
            type='text'
          />
          <Button onClick={sendMessage} type='submit'>
            Send a message
            
          </Button>
        </form>
        <IconButton>
        <SendIcon onClick={sendMessage} type='submit' />
        </IconButton>
        <IconButton>
        <MicIcon />

        </IconButton>
      </div>
    </div>
  )
}

export default Chat
