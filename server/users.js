const users =[];

const addUser = ({id, name, room}) =>{
//we convert the name entered to as
//shikha brah ~ shikhabrah
//trim removes the extra spaces
name= name.trim().toLowerCase();
room= room.trim().toLowerCase();

//check if the user is siging with same name and room that is forbeddin
const existinguser= users.find((user)=>
user.room === room && user.name===name)

if(existinguser) {
    return {error: 'USername already exist'};
}

const user={id, name, room};
users.push(user);
return { user};
}

const removeUser= (id) =>{
const index = users.findIndex((user)=>user.id===id);

if(index !==-1)
{    //removes from the array
    return users.splice(index, 1)[0];
}


}

const getUser = (id) => users.find((user) => user.id === id);

const getUserInroom = (room) => users.filter((user) => user.room === room);

module.exports={addUser, removeUser, getUser, getUserInroom};