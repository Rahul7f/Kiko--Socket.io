const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const formateMessage = require('./util/messages')
const {userJoin,getCurrentUser,userLeave,getRoomUser}= require('./util/user')

const app = express()
const server = http.createServer(app)
const io = socketio(server);

//set static folder 
app.use(express.static(path.join(__dirname, 'public')));
const boatname = 'Rsin'
//run when clint connect
io.on('connection', socket => {
    // join specific chat room
    socket.on('joinRoom', ({ username, room }) => {
        // calling fucntion form message this will store user in array anr return user object which added
        const user = userJoin(socket.id,username,room);
        // here user is a constant which  have object of  currently added user
        // sockect join is a propery by which 
        socket.join(user.room)
        // weclome current user
        socket.emit('message', formateMessage(boatname, `Welcome ${user.username} I'm your Bot Rsin`))

        //broadcast when a user connects
        socket.broadcast.to(user.room)
        .emit('message', formateMessage(boatname, `${user.username} joined the chat`));
        //send user and room info
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users:getRoomUser(user.room)
        })
    })

    //listion for chatmessage
    socket.on('chatMessage', msg => {
        // here user already added in database so  we can get
        // current user by socket id by our function currentuser
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', formateMessage(user.username, msg))
        });

        //run when clint disconenct
        socket.on('disconnect', () => {
            const user = userLeave(socket.id);
            if (user) {
                io.to(user.room).emit('message', formateMessage(boatname,`${user.username} has left the  chat`));
            }
            
        //send user and room info
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users:getRoomUser(user.room)
        })  

    })


})


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
server.listen(port, () => {
    console.log("server is running");
})