// const mongoose = require('mongoose')

// // mongodb data
// mongoose.connect('mongodb://localhost:22704/ChatAppDB', { useNewUrlParser: true, useUnifiedTopology: true });

// const UsersSchema = new mongoose.Schema({
//     socketID:String,
//     username:String,
//     room:String
//   });

//   const NewUser = mongoose.model("Users", UsersSchema);


const users = [];
//join user to chat
function userJoin(id,username,room) {
    // const user = new NewUser({
    //     socketID: id,
    //     username: username,
    //     room: room
    // })
    // user.save();

    const user = {id,username,room};
    users.push(user);
    return user;
}

//get current user
function getCurrentUser(id) {
    return users.find(user => user.id ==id);
}
//user leaves the chat
function userLeave(id) {
    const index = users.findIndex(user=>user.id===id);
    if (index!=-1) {
        //splice use to add or remove item form array 
        //and return removed element
        return users.splice(index,1)[0];
    }
}
//get room user
function getRoomUser(room) {
    return users.filter(user => user.room ===room)
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUser
}