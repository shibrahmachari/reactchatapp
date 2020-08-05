import React, {useState, useEffect} from 'react'
import queryString from'query-string'
import io from 'socket.io-client';
import './Chat.css'
import InfoBar from '../InfoBar/InfoBar.js';
import Input from '../Input/Input.js';
import Messages from '../Messages/Messages.js';
let socket;
const ENDPOINT= 'localhost:5000';
 const Chat = ({location}) => {
    
    const [name, setName]= useState('');
    const [room, setRoom]= useState('');
    const [message, setMessage]= useState([]);
    const [messages, setMessages]= useState([]);
    //this is similar to componentwillmount
   useEffect(()=>{
       //location contains the query
    const {name, room}= queryString.parse(location.search);
    //location search returns the parameters from the url
    console.log(name, room);

    socket =io(ENDPOINT); //providing end point to the server
    setName(name);
    setRoom(room);

    //sent from the client to the server, third parameter is the server callback
    /*socket.emit('join', {name, room}, ({error})=>{
        alert(error);
    });*/

    socket.emit('join', {name, room}, ()=>{

    });

    //unmounting
    return () =>{
        socket.emit('disconnect');

        //this one instance of client is tur off
        socket.off();
    }


   }, [ENDPOINT, location.search]);
   
   
   //this hook for keeping a track of the messages
   //recieves from server
   useEffect(() => {
       socket.on('message', (message)=>{
           //storing messages form admin or other users
        setMessages(messages=>[...messages, message])
       });
   }, [])

   const sendMessage=(event)=>{

    event.preventDefault();
       if(message){
           //clear the input
           socket.emit('sendMessage', message, ()=>
           setMessage('')
           )
       }
   }
console.log(message, messages);
   //function for sending message
    return (
        <div className="outerContainer">
        <div className="container">
        <InfoBar room={room}/>
        <Messages messages={messages} name={name}/>
        <Input setMessage={ setMessage} sendMessage={sendMessage} message={message} />
       </div>
      </div>
    )
}
export default Chat;