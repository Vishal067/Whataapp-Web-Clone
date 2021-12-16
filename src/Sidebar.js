import React, { useEffect, useState } from 'react'
import './Sidebar.css'
import { Avatar, Button, IconButton } from '@material-ui/core'
import DonutLargeIcon from '@material-ui/icons/DonutLarge'
import ChatIcon from '@material-ui/icons/Chat'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { SearchOutlined } from '@material-ui/icons'
import SidebarChat from './SidebarChat'
import db from './firebase'
import { useStateValue } from './StateProvider';
import { Link } from 'react-router-dom';


function Sidebar () {
  const [rooms, setRooms] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const [serachTxt,setSearchTxt] = useState([])
  const [id,setId] = useState('')
  const [seed, setSeed] = useState('');


  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000))
  }, [])



  useEffect(() => {
    const unsubscribe = db.collection('rooms').onSnapshot(snapshot =>
      setRooms(
        snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        }))
      )
    );
    return () => {
      unsubscribe();
    }
  }, []);


  const searchData = (searchData) => { 
  
    const result = rooms.filter( item =>      item.data.name === searchData )
    console.log('search final data',result) 
    setSearchTxt(result)
    const newId = rooms.filter( item => item.id )
    setId(newId)

  
  }


console.log('users data',user)
  return (
    <div className='sidebar'>
      <div className='sidebar__header'>
        <Avatar src={user?.photoURL}/>
        <h5 className='display_name'  >{user.displayName}</h5>
        <div className='sidebar__headerRight'>
       
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
   

  

      <div className='sidebar__search'>
        <div className='sidebar__searchContainer'>
          <SearchOutlined />
          <input type='text' placeholder='Search or start new chat' onChange={(event)=>searchData(event.target.value)}  />
        </div>
      </div>
      {
     serachTxt.length ? 
    serachTxt.map(data=>{
      console.log('data----',data.id)
      return (
    <Link to={`/rooms/${data.id}`}>
        <div className='final-result'  >
          
             <Avatar sx={{ height: '20px', width: '20px' }}  src={`https://avatars.dicebear.com/api/human/${seed}.svg`}  />
            
          <h3>{data.data.name}</h3>
        </div>
     </Link>
      )
    })
     
     
     :
     null
   }
      <div className='sidebar__chats'>
        <SidebarChat addNewChat />
        {rooms.map(room => (
        
          <SidebarChat key={room.id} id={room.id} name={room.data.name} />
        ))}
      </div>
    </div>
  )
}

export default Sidebar
