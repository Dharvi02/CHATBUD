const path = require("path");         //server
const http= require("http");
const express = require("express");
const socketio =require('socket.io');
const { userJoin, getCurrentUser ,getRoomUsers,
    userLeave}= require('./utils/users');

const  formatMessage = require('./utils/message');
const app = express();                 //server

const server = http.createServer(app);       
                                            
const io =socketio(server);                    

app.use(express.static(path.join(__dirname,'public')));
const botName = 'Chatcord bot';  
io.on('connection', socket =>{
    socket.on('joinRoom',({username,room})=>{

        const user = userJoin(socket.id,username, room);
        socket.join(user.room);
        //console.log('new connection...');

        socket.emit('message',formatMessage(botName,` WELCOME `));
        socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined ` ));

        io.to(user.room).emit('roomUsers',{
            room :user.room,
            users:getRoomUsers(user.room)
        
        });
    }) ;
        //  socket.on('chatMessage',msg=>{
        //     const user = getCurrentUser(socket.id);
        //     io.to(user.room).emit('message',formatMessage(user.username,msg));

        // });



   
    socket.on('chatMessage',msg=>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,msg))
    });
    socket.on('disconnect',()=>{
        const user =userLeave(socket.id);
        if(user){
        io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left`));}
        io.to(user.room).emit('roomUsers',{
            room :user.room,
            users:getRoomUsers(user.room)
        
        });
    
    });
  
}

);                                           


const PORT =3000 || process.env.PORT     //server

server.listen(PORT, ()=>                 //server
console.log(`Server is running on ${PORT}`));


//fvugyrjhabe with the best of it you but when two it the fest porhfbbvfv 'jrb  