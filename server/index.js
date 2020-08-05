const express= require('express');
const socketio= require('socket.io');
var http= require('http');
const {addUser, removeUser, getUser, getUserInroom}= require('./users');
const PORT= process.env.PORT || 5000;
const router= require('./router');
const cors = require('cors');

const app= express();
app.use(cors());
const server= http.createServer(app);
const io= socketio(server);
app.use(router);
//connection of a client to the server, socket the client instance
io.on('connect', (socket) =>{
   console.log('We have a new coneection');

   //this is basically the server having access to the client data on backened
   socket.on('join', ({name, room}, callback)=>{
    const {error, user} = addUser({id:socket.id, name, room});
    if(error) return callback(error);
    
    //joins the user to the room
    
    socket.join(user.room); 

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
   
    io.to(user.room).emit('roomData', { room: user.room, users: getUserInroom(user.room) });
    
    //io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    callback();
   });

   //expecting from frontend from users
   //for user generated message- sendmesage
   socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });
    //io.to(user.room).emit('roomData', { room: user.room, text: message });

    callback();
  });



   socket.on('disconnect', ()=>{
      const user= removeUser(socket.id);
      console.log(user.room);
      if(user) {
        io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
         io.to(user.room).emit('roomData', { room: user.room, users: getUserInroom(user.room)});
      }
   })

})




server.listen(PORT, ()=>{
    console.log('server has started!!');
})